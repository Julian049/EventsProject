const Purchase = require('../models/purchase');
const TicketService = require('../services/ticketService');
const TicketModel = require('../models/ticketModel');
const PurchaseModel = require('../models/purchaseModel');
const UserModel = require('../models/userModel');
const EventModel = require('../models/eventModel');
const EventTicketTypeModel = require('../models/eventTicketTypeModel');
const EventTicketTypeService = require('../services/eventTicketTypeService');
const Role = require('../constants/role');
const QRCode = require('qrcode');
const {v4: uuidv4} = require('uuid');
const {tx} = require("../database");


exports.createPurchase = async ({ userId, eventId, items }) => {
    const event = await EventModel.getById(eventId);
    const user  = await UserModel.getById(userId);

    if (!event)                   throw new Error('Evento no encontrado');
    if (event.status !== 'Active') throw new Error('Evento no activo');
    if (user.role !== Role.user)   throw new Error('Rol de usuario no valido para comprar');

    
    const eventTicketTypes = await Promise.all(
        items.map(({ ticketTypeId }) =>
            EventTicketTypeModel.getByIds(eventId, ticketTypeId)
        )
    );

    for (let i = 0; i < items.length; i++) {
        const ett = eventTicketTypes[i];
        if (!ett) throw new Error(`Tipo de ticket no encontrado`);
        if (items[i].quantity > parseInt(ett.availableQuantity))
            throw new Error(`No hay suficientes tickets disponibles para ${ett.name ?? ticketTypeId}`);
    }

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

            // Descontar stock
            const newQty = parseInt(ett.availableQuantity) - quantity;
            await EventTicketTypeModel.updateAvailableQuantity(eventId, ticketTypeId, newQty, t);

            // Generar tickets con QR
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

    return allTickets;
};


exports.updatePurchase = async (id) => {
    const purchase = await PurchaseModel.getById(id);

    if (!purchase)
        throw new Error('Compra no encontrada');

    return PurchaseModel.updateStatusToComplete(id);
};

exports.getMyPurchases = (userId) => {
    return PurchaseModel.getByUser(userId);
};

exports.getMyPurchasesWithTickets = async (userId) => {
    const purchases = await PurchaseModel.getByUser(userId);
    const result = [];
    for (const purchase of purchases) {
        const tickets = await TicketModel.getTicketsByPurchase(purchase.id);
        result.push({...purchase, tickets});
    }
    return result;
};