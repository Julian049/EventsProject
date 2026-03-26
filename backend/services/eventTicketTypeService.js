const EventTicketType = require('../models/eventTicketType');
const EventTicketTypeModel = require('../models/eventTicketTypeModel');
const EventModel = require('../models/eventModel');
const TicketTypeModel = require('../models/ticketTypeModel');

exports.createEventTicketType = async (eventTicketType) => {
    const newEventTicketType = new EventTicketType(eventTicketType);
    const ticketType = await EventTicketTypeModel.getByIds(newEventTicketType.eventId, newEventTicketType.ticketTypeId);

    if (ticketType) {
        throw new Error('Tipo de entrada ya existe');
    }

    return EventTicketTypeModel.create(newEventTicketType);
}

exports.getAllTicketTypes = async (eventId) => {
    const event = await EventModel.getById(eventId);
    if (!event) {
        throw new Error('Evento no encontrado');
    }
    const ticketTypes = await EventTicketTypeModel.getTicketTypesByEventId(eventId);
    return ticketTypes;
}

exports.getTicketTypeByIds = async (eventId, ticketId) => {
    const event = await EventModel.getById(eventId);
    const ticket = await TicketTypeModel.getById(eventId);
    if (!event) {
        throw new Error('Evento no encontrado');
    }
    if (!ticket) {
        throw new Error('Tipo de entrada no encontrado');
    }
    const tickets = await EventTicketTypeModel.getByIds(eventId, ticketId);
    return tickets;
}

exports.updateAvailableQuantity = async (eventId, ticketTypeId, quantity) => {
    const event = await EventModel.getById(eventId);
    const ticket = await TicketTypeModel.getById(ticketTypeId);
    if (!event) {
        throw new Error('Evento no encontrado');
    }
    if (!ticket) {
        throw new Error('Tipo de entrada no encontrado');
    }

    const ticketToUpdate = await EventTicketTypeModel.getByIds(eventId, ticketTypeId);
    const actualQuantity = parseInt(ticketToUpdate.availableQuantity);

    let newQuantity;
    let ticketTypes;
    if (actualQuantity < quantity) {
        throw new Error('No hay suficientes entradas disponibles');
    } else {
        newQuantity = actualQuantity - quantity;
        ticketTypes = await EventTicketTypeModel.updateAvailableQuantity(eventId, ticketTypeId, newQuantity);
    }
    return ticketTypes;
}
exports.updateTicketType = async (eventId, ticketTypeId, totalQuantity, availableQuantity, price) => {
    const ticketType = await TicketTypeModel.getById(ticketTypeId);
    const event = await TicketTypeModel.getById(eventId);
    if (!ticketType) {
        throw new Error('Tipo de entrada no encontrado');
    }
    if (!event) {
        throw new Error('Evento no encontrado');
    }

    const updateTicket = EventTicketTypeModel.updateTicketType(eventId, ticketTypeId, totalQuantity, availableQuantity, price);
    return updateTicket;
}

exports.deleteTicketType = async (eventId, ticketTypeId) => {
    const ticketType = await TicketTypeModel.getById(ticketTypeId);
    const event = await TicketTypeModel.getById(eventId);
    if (!ticketType) {
        throw new Error('Tipo de entrada no encontrado');
    }
    if (!event) {
        throw new Error('Evento no encontrado');
    }

    EventTicketTypeModel.deleteTicketType(eventId, ticketTypeId);
}