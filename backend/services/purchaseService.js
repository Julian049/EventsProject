const Purchase = require('../models/purchase');
const PurchaseModel = require('../models/purchaseModel');
const EventModel = require('../models/eventModel');
const EventTicketTypeModel = require('../models/eventTicketTypeModel');

exports.createPurchase = async (purchase) => {
    console.log("00");
    const newPurchase = new Purchase(purchase);
    let out;

    console.log("01");
    const event_ticket_type = await EventTicketTypeModel.getById(purchase.event_ticket_type_id);
    console.log("02");

    const event = await EventModel.getById(event_ticket_type.event_id);

    console.log("1");

    if (!event) {
        throw new Error('Evento no encontrado');
    }

    console.log("2");

    if (event.status === 'Active') {
        newPurchase.total_amount = event_ticket_type.price * purchase.quantity;
        console.log("3");
        if (newPurchase.quantity > 0) {
            out = PurchaseModel.create(newPurchase);
        }
        console.log("4");
    } else {
        throw new Error('Evento no disponible para compra');
    }

    return out
}