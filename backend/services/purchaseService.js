const Purchase = require('../models/purchase');
const TicketModel = require('../models/ticketModel');
const PurchaseModel = require('../models/purchaseModel');
const UserModel = require('../models/userModel');
const EventModel = require('../models/eventModel');
const EventTicketTypeModel = require('../models/eventTicketTypeModel');
const Role = require('../constants/role');
const QRCode = require('qrcode');
const {v4: uuidv4} = require('uuid');
const {tx} = require("../database");
const logger = require('../utils/logger');
const { getChannel, EXCHANGE, ROUTING_KEY } = require('../config/rabbitmq');
const { createTransactionEventDTO } = require('../dtos/transactionEventDTO');

async function callPaymentGateway(cardNumber, cvv, totalAmount,franchiseId) {
    logger.info(`[Pasarela] Intentando cargo a tarjeta por un total de $${totalAmount}`);

    const response = await fetch(process.env.PASARELA_URL + '/payment-gateway', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            merchantId: process.env.EMPRESA_ID,
            cardNumber,
            cvv,
            amount: totalAmount,
            franchiseId: franchiseId,
        }),
    });

    const data = await response.json();

    if (!response.ok)        throw new Error(data.message || 'Error al procesar el pago');
    if (data.status !== 'APROBADO') throw new Error('Pago rechazado por la entidad bancaria');

    logger.info(`[Pasarela] Pago aprobado exitosamente`);
    return data;
}

exports.createPurchase = async ({ userId, eventId, items, cardNumber, cvv, franchiseId }) => {
    logger.info(`[Service] Iniciando proceso de compra - Usuario: ${userId}, Evento: ${eventId}`);

    const event = await EventModel.getById(eventId);
    const user  = await UserModel.getById(userId);

    if (!event)                    throw new Error('Evento no encontrado');
    if (event.status !== 'Active') throw new Error('Evento no activo');
    if (user.role !== Role.user)   throw new Error('Rol de usuario no valido para comprar');

    const eventTicketTypes = await Promise.all(
        items.map(({ ticketTypeId }) =>
            EventTicketTypeModel.getByIds(eventId, ticketTypeId)
        )
    );

    for (let i = 0; i < items.length; i++) {
        const ett = eventTicketTypes[i];
        if (!ett) throw new Error('Tipo de ticket no encontrado');
        if (items[i].quantity > parseInt(ett.availableQuantity))
            throw new Error(`No hay suficientes tickets disponibles para ${ett.name ?? items[i].ticketTypeId}`);
    }

    const totalAmount = eventTicketTypes.reduce((sum, ett, i) =>
        sum + parseFloat(ett.price) * items[i].quantity, 0
    );

    let gatewayResponse;
    try {
        gatewayResponse = await callPaymentGateway(cardNumber, cvv, totalAmount, franchiseId);
    } catch (e) {
        publishTransactionEvent(createTransactionEventDTO({
            purchaseId: null,
            eventName: event.name,
            description: event.description,
            error: true,
            message: e.message,
        }));
        throw e;
    }

    if (gatewayResponse.status !== 'APROBADO') {
        publishTransactionEvent(createTransactionEventDTO({
            purchaseId: null,
            eventName: event.name,
            description: event.description,
            error: true,
            message: `Pago rechazado por la entidad bancaria. Transacción: ${gatewayResponse.transactionId}`,
        }));
        throw new Error('Pago rechazado por la entidad bancaria');
    }

    logger.info(`[Service] Pago aprobado. Transacción: ${gatewayResponse.transactionId} - Fecha: ${gatewayResponse.date}`);
    logger.info(`[Service] Ejecutando transacción en Base de Datos...`);

    const allTickets = await tx(async (t) => {
        const results = [];

        for (let i = 0; i < items.length; i++) {
            const { ticketTypeId, quantity } = items[i];
            const ett   = eventTicketTypes[i];
            const price = parseFloat(ett.price);

            const newPurchase = new Purchase({
                userId,
                eventTicketTypeId: ett.id,
                quantity,
                totalAmount: quantity * price,
            });

            const purchaseCreated = await PurchaseModel.create(newPurchase, t);

            const newQty = parseInt(ett.availableQuantity) - quantity;
            await EventTicketTypeModel.updateAvailableQuantity(eventId, ticketTypeId, newQty, t);

            const ticketPromises = [];
            for (let j = 0; j < quantity; j++) {
                const ticketCode = uuidv4();
                const qrCode = await QRCode.toDataURL(ticketCode);
                ticketPromises.push(TicketModel.create({ purchaseId: purchaseCreated.id, qrCode }, t));
            }
            const tickets = await Promise.all(ticketPromises);
            results.push(...tickets);
        }

        return results;
    });

    logger.info(`[Service] Compra guardada. Se generaron ${allTickets.length} tickets con QR.`);

    publishTransactionEvent(createTransactionEventDTO({
        purchaseId: allTickets[0]?.purchaseId,
        eventName: event.name,
        description: event.description,
        error: false,
        message: `Pago aprobado. Transacción: ${gatewayResponse.transactionId} - ${gatewayResponse.date}`,
    }));

    return allTickets;
};

function publishTransactionEvent(dto) {
    try {
        const channel = getChannel();
        channel.publish(EXCHANGE, ROUTING_KEY, Buffer.from(JSON.stringify(dto)), { persistent: true });
        logger.info(`[RabbitMQ] Evento publicado - error: ${dto.error}`);
    } catch (e) {
        logger.error(`[RabbitMQ] Fallo al publicar evento: ${e.message}`);
    }
}

exports.updatePurchase = async (id) => {
    logger.info(`[Service] Modificando estado de la compra ID: ${id}`);
    const purchase = await PurchaseModel.getById(id);
    if (!purchase) throw new Error('Compra no encontrada');
    return PurchaseModel.updateStatusToComplete(id);
};

exports.getMyPurchases = (userId) => PurchaseModel.getByUser(userId);

exports.getMyPurchasesWithTickets = async (userId) => {
    return PurchaseModel.getByUser(userId);
};