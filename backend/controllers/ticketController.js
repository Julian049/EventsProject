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
        const tickets = await ticketService.getTicketsByPurchase(purchaseId);
        res.json(tickets);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
}
