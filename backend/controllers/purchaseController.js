const purchaseService = require('../services/purchaseService');

exports.createPurchase = async (req, res) => {
    try {
        const eventId = parseInt(req.params.id);
        const { items } = req.body;  
        const userId = req.user?.id;

        if (!Array.isArray(items) || items.length === 0)
            return res.status(400).json({ error: 'Debes enviar al menos un tipo de boleta' });

        const newPurchase = await purchaseService.createPurchase({ userId, eventId, items });
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

exports.getMyPurchases = async (req, res) => {
    try {
        const userId = req.user.id;
        const purchases = await purchaseService.getMyPurchasesWithTickets(userId);
        res.status(200).json(purchases);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
}

