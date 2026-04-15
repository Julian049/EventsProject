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

exports.createPurchase = async ({userId, eventId, ticketTypeId, quantity}) => {

    const event = await EventModel.getById(eventId);
    const user = await UserModel.getById(userId);

    if (!event)
        throw new Error('Evento no encontrado');

    const eventTicketType = await EventTicketTypeModel.getByIds(eventId, ticketTypeId);
    const actualQuantity = parseInt(eventTicketType.availableQuantity);
    const price = parseFloat(eventTicketType.price);


    if (event.status !== 'Active')
        throw new Error('Evento no activo');

    if (user.role !== Role.user)
        throw new Error('Rol de usuario no valido para comprar');

    if (quantity > actualQuantity)
        throw new Error('No hay suficientes tickets disponibles');

    const tickets = await tx(async (t) => {

        const newPurchase = new Purchase({
            userId,
            eventTicketTypeId: eventTicketType.id,
            quantity,
            totalAmount: quantity * price,
        });

        const purchaseCreated = await PurchaseModel.create(newPurchase, t);


        await EventTicketTypeService.updateAvailableQuantity(eventId, ticketTypeId, quantity, t);

        const ticketPromises = [];
        for (let i = 0; i < quantity; i++) {
            const ticketCode = uuidv4();
            const qrCode = await QRCode.toDataURL(ticketCode);
            ticketPromises.push(
                TicketModel.create({purchaseId: purchaseCreated.id, qrCode}, t)
            );
        }
        return Promise.all(ticketPromises);
    });

    return tickets;
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