const Ticket = require("../models/ticket");
const TicketModel = require("../models/ticketModel");
const PurchaseModel = require("../models/purchaseModel");

exports.createTicket = async (ticket) => {
    const newTicket = new Ticket(ticket);
    const purchase = await PurchaseModel.getById(newTicket.purchaseId);

    if (!purchase) {
        throw new Error('La compra no existe');
    }

    return TicketModel.create(newTicket);
}

exports.getById = async (id) => {
    const ticket = await TicketModel.getById(id);
    return ticket;
}

exports.getTicketsByPurchase = async (purchaseId, userId) => {
    const purchase = await PurchaseModel.getById(purchaseId);
    if (!purchase) {
        throw new Error('La compra no existe');
    }
    if (purchase.user_id !== userId) {
        throw new Error('Acceso denegado');
    }
    return TicketModel.getTicketsByPurchase(purchaseId);
}