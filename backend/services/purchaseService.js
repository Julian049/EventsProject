const Purchase = require('../models/purchase');
const PurchaseModel = require('../models/purchaseModel');
const UserModel = require('../models/userModel');
const EventModel = require('../models/eventModel');
const EventTicketTypeModel = require('../models/eventTicketTypeModel');
const Role = require('../constants/role');

exports.createPurchase = async ({userId, eventId, ticketTypeId, quantity}) => {
    let out;

    console.log(eventId)
    console.log(userId)

    console.log("5")
    console.log("6")
    const event = await EventModel.getById(eventId);
    const user = await UserModel.getById(userId);
    console.log(user)

    if (!event)
        throw new Error('Evento no encontrado');

    const eventTicketType = await EventTicketTypeModel.getByIds(eventId, ticketTypeId)
    const actualQuantity = parseInt(eventTicketType.availableQuantity)
    const price = parseFloat(eventTicketType.price);

    console.log("7")
    if (event.status === 'Active') {
        console.log("8")
        console.log("Rol: "+ user.role)
        console.log("Rol 2: " + Role.user)
        if (user.role === Role.user) {
            console.log("9")
            if (quantity <= actualQuantity) {
                console.log("10")
                const newPurchase = new Purchase({
                    userId,
                    eventTicketTypeId: eventTicketType.id,
                    quantity,
                    totalAmount: quantity * price,
                });
                console.log("11")
                out = await PurchaseModel.create(newPurchase);
                EventTicketTypeModel.updateAvailableQuantity(eventId,ticketTypeId,quantity)
            }else {
                throw new Error('No hay suficientes tickets disponibles');
            }
        } else {
            throw new Error('Rol de usuario no valido para comprar');
        }
    } else {
        throw new Error('Evento no activo');
    }


    return out
}