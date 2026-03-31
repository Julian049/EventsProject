const Purchase = require('../models/purchase');
const TicketService = require('../services/ticketService');
const PurchaseModel = require('../models/purchaseModel');
const UserModel = require('../models/userModel');
const EventModel = require('../models/eventModel');
const EventTicketTypeModel = require('../models/eventTicketTypeModel');
const Role = require('../constants/role');

exports.createPurchase = async ({userId, eventId, ticketTypeId, quantity}) => {
    let purchaseCreated;
    let tickets = []

    const event = await EventModel.getById(eventId);
    const user = await UserModel.getById(userId);

    if (!event)
        throw new Error('Evento no encontrado');

    const eventTicketType = await EventTicketTypeModel.getByIds(eventId, ticketTypeId)
    const actualQuantity = parseInt(eventTicketType.availableQuantity)
    const price = parseFloat(eventTicketType.price);


    let ticketPurchased;
    if (event.status === 'Active') {
        if (user.role === Role.user) {
            if (quantity <= actualQuantity) {
                const newPurchase = new Purchase({
                    userId,
                    eventTicketTypeId: eventTicketType.id,
                    quantity,
                    totalAmount: quantity * price,
                });
                purchaseCreated = await PurchaseModel.create(newPurchase);
                EventTicketTypeModel.updateAvailableQuantity(eventId, ticketTypeId, quantity)
                for (let i = 0; i < quantity; i++) {
                    const ticket = {
                        purchaseId: purchaseCreated.id,
                        qrCode: "Aca deberia ir el qr" + purchaseCreated.id + i
                    }
                    ticketPurchased = await TicketService.createTicket(ticket)
                    tickets.push(ticketPurchased)
                }
            } else {
                throw new Error('No hay suficientes tickets disponibles');
            }
        } else {
            throw new Error('Rol de usuario no valido para comprar');
        }
    } else {
        throw new Error('Evento no activo');
    }


    return tickets
}