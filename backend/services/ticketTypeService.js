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

exports.getAll = async () => {
    const tickets = await TicketTypeModel.getAll();
    return tickets;
}

exports.getById = async (id) => {
    const ticket = await TicketTypeModel.getById(id)
    if (!ticket) {
        throw new Error('El tipo de entrada no existe');
    }
    return ticket;
}