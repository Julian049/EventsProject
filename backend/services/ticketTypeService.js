const TicketType = require('../models/ticketType');
const TicketTypeModel = require('../models/ticketTypeModel');

exports.createTicketType = async (ticketType) => {
    const newTicketType = new TicketType(ticketType);
    const tickets = await TicketTypeModel.getAll();

    const exists = tickets.some(
        ticket => ticket.name.toUpperCase() === newTicketType.name.toUpperCase()
    );

    if (exists) {
        throw new Error('Tipo de entrada ya existe');
    }

    return TicketTypeModel.create(newTicketType);
}