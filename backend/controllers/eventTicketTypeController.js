const eventTicketTypeService = require('../services/eventTicketTypeService');

exports.createEventTicketType = async (req, res) => {
    try {
        const newEventTicketType = await eventTicketTypeService.createEventTicketType(req.body);
        res.status(201).json(newEventTicketType);
    } catch (err) {
        if (err.message === 'Tipo de entrada ya existe') {
            return res.status(409).json({ error: err.message });
        }
        return res.status(500).json({ error: err.message });
    }
};

exports.getAllTicketTypes = async (req, res) => {
    try {
        const { eventId } = req.params;
        const ticketTypes = await eventTicketTypeService.getAllTicketTypes(eventId);

        if (!ticketTypes || ticketTypes.length === 0) {
            return res.status(204).send();
        }

        return res.status(200).json(ticketTypes);
    } catch (err) {
        if (err.message === 'Evento no encontrado') {
            return res.status(404).json({ error: err.message });
        }
        return res.status(500).json({ error: 'Error al obtener tipos de entrada del evento' });
    }
};

exports.getTicketTypeByIds = async (req, res) => {
    try {
        const { eventId, ticketId } = req.params;
        const ticket = await eventTicketTypeService.getTicketTypeByIds(eventId, ticketId);
        return res.status(200).json(ticket);
    } catch (err) {
        if (err.message === 'Evento no encontrado' || err.message === 'Tipo de entrada no encontrado') {
            return res.status(404).json({ error: err.message });
        }
        return res.status(500).json({ error: err.message });
    }
};

exports.updateAvailableQuantity = async (req, res) => {
    try {
        const { eventId, ticketTypeId } = req.params;
        const quantity = parseInt(req.body.quantity);
        const ticketTypes = await eventTicketTypeService.updateAvailableQuantity(eventId, ticketTypeId, quantity);
        return res.status(200).json(ticketTypes);
    } catch (err) {
        if (err.message === 'No hay suficientes entradas disponibles') {
            return res.status(400).json({ error: err.message });
        }
        if (err.message === 'Evento no encontrado' || err.message === 'Tipo de entrada no encontrado') {
            return res.status(404).json({ error: err.message });
        }
        return res.status(500).json({ error: err.message });
    }
};

exports.updateTicketType = async (req, res) => {
    try {
        const { eventId, ticketTypeId } = req.params;
        const { totalQuantity, availableQuantity, price } = req.body;
        const updatedTicket = await eventTicketTypeService.updateTicketType(eventId, ticketTypeId, totalQuantity, availableQuantity, price);
        return res.status(200).json(updatedTicket);
    } catch (err) {
        if (err.message === 'Evento no encontrado' || err.message === 'Tipo de entrada no encontrado') {
            return res.status(404).json({ error: err.message });
        }
        return res.status(500).json({ error: err.message });
    }
};

exports.deleteTicketType = async (req, res) => {
    try {
        const { eventId, ticketTypeId } = req.params;
        await eventTicketTypeService.deleteTicketType(eventId, ticketTypeId);
        return res.status(204).send();
    } catch (err) {
        if (err.message === 'Evento no encontrado' || err.message === 'Tipo de entrada no encontrado') {
            return res.status(404).json({ error: err.message });
        }
        return res.status(500).json({ error: err.message });
    }
};
