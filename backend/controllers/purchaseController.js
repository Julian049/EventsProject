const purchaseService = require('../services/purchaseService');

exports.createPurchase = async (req, res) => {
    try {
        console.log("1")
        const eventId = parseInt(req.params.id);
        console.log("2")
        const {ticketTypeId, quantity} = req.body;
        console.log("3")
        const userId = req.user?.id || req.body.userId;

        console.log("4")
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