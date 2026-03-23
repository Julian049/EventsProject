const ticketTypeService = require('../services/ticketTypeService');

exports.createTicketType = async (req, res) => {
    try {
        const newTicketType = await ticketTypeService.createTicketType(req.body);
        res.json(newTicketType);
    } catch (err) {
        return res.status(409).json({error: err.message});
    }
}

exports.getAllTicketTypes = async (req, res) => {
    try {
        const tickets = await ticketTypeService.getAll();

        if (tickets.length === 0) {
            return res.status(204).send();
        }

        return res.status(200).json(tickets);

    } catch (err) {
        console.error(err);
        return res.status(500).json({error: 'Error al obtener tipos de entrada'});
    }
}

exports.getById = async (req, res) => {
    try {
        const {id} = req.params;
        const ticket = await ticketTypeService.getById(id);
        return res.status(200).json(ticket);
    } catch (err) {
        if (err.message === 'El tipo de entrada no existe') {
            return res.status(404).send({error: err.message});
        }
        return res.status(500).json({error: err.message});
    }
}

