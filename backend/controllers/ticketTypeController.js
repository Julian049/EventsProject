const ticketTypeService = require('../services/ticketTypeService');

exports.createTicketType = async (req, res) => {
    try {
        const newTicketType = await ticketTypeService.createTicketType(req.body);
        res.json(newTicketType);
    } catch (err) {
        return res.status(409).json({error: err.message});
    }
}
