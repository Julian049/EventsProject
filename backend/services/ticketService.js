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

exports.getTicketsByPurchase = async (purchaseId) => {
    const purchase = PurchaseModel.getById(purchaseId);
    if (!purchase) {
        throw new Error('La compra no existe');
    }

    const tickets = await TicketModel.getTicketsByPurchase(purchaseId);
    return tickets;
}