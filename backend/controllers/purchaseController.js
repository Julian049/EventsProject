const purchaseService = require('../services/purchaseService');

exports.createPurchase = async (req, res) => {
    console.log("5");
    try {
        console.log("6");
        const newEvent = await purchaseService.createPurchase(req.body);
        res.json(newEvent);
        console.log("7");
    } catch (err) {
        if (err.message === 'Evento no encontrado') {
            return res.status(404).json({error: err.message});
        } else if (err.message === 'Evento no disponible para compra') {
            return res.status(409).json({error: err.message});
        }
        res.status(500).json({error: err.message});
    }
}