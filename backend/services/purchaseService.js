const Purchase = require('../models/purchase');
const PurchaseModel = require('../models/purchaseModel');
const EventModel = require('../models/eventModel');
const EventTicketTypeModel = require('../models/eventTicketTypeModel');

exports.createPurchase = async (purchase) => {
    const newPurchase = new Purchase(purchase);

    const ticket_type = await EventTicketTypeModel.getById(purchase.event_id);
    const event = await EventModel.getById(ticket_type.event_id);

    if (!event) {
        throw new Error('Evento no encontrado');
    }

    if (event.status === 'Active') {
        newPurchase.total_amount = ticket_type.price * purchase.quantity;
        if (newPurchase.quantity > newPurchase.total_amount) {}
    } else {
        throw new Error('Evento no disponible para compra');
    }


    return PurchaseModel.create(newPurchase)
}