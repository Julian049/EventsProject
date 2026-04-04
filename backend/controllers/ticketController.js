const ticketService = require('../services/ticketService');

exports.createTicket = async (req, res) => {
    try {
        const newTicket = await ticketService.createTicket(req.body);
        res.json(newTicket);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
}

exports.getById = async (req, res) => {
    try {
        const {id} = req.params;
        const ticket = await ticketService.getById(id);
        res.json(ticket);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
}

exports.getTicketsByPurchase = async (req, res) => {
    try {
        const {purchaseId} = req.params;
        const userId = req.user.id;
        const tickets = await ticketService.getTicketsByPurchase(purchaseId, userId);
        res.json(tickets);
    } catch (err) {
        if (err.message === 'Acceso denegado') {
            return res.status(403).json({error: err.message});
        }
        if (err.message === 'La compra no existe') {
            return res.status(404).json({error: err.message});
        }
        res.status(500).json({error: err.message});
    }
}
