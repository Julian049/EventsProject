const purchaseService = require('../services/purchaseService');

exports.createPurchase = async (req, res) => {
    try {
        const eventId = parseInt(req.params.id);
        const {ticketTypeId, quantity} = req.body;
        const userId = req.user?.id;
        const newPurchase = await purchaseService.createPurchase({userId, eventId, ticketTypeId, quantity});
        res.status(201).json(newPurchase);

    } catch (err) {
        if (err.message === 'Evento no encontrado') {
            return res.status(404).json({error: err.message});
        }
        if (err.message === 'Tipo de ticket no encontrado') {
            return res.status(404).json({error: err.message});
        }
        if (err.message === 'Evento no activo') {
            return res.status(409).json({error: err.message});
        }
        if (err.message === 'Rol de usuario no valido para comprar') {
            return res.status(403).json({error: err.message});
        }
        if (err.message === 'No hay suficientes tickets disponibles') {
            return res.status(409).json({error: err.message});
        }
        res.status(500).json({error: err.message});
    }
};

exports.updatePurchase = async (req, res) => {
    try {
        const purchaseId = req.params.id;
        const purchaseUpdate =await purchaseService.updatePurchase(purchaseId)
        res.status(201).json({purchaseUpdate})
    } catch (err) {
        if (err.message === 'Compra no encontrada') {
            return res.status(404).json({error: err.message});
        }
        res.status(500).json({error: err.message});
    }
}