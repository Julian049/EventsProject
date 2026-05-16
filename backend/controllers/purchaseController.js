const purchaseService = require('../services/purchaseService');

exports.createPurchase = async (req, res) => {
    try {
        const eventId = parseInt(req.params.id);
        const { items, cardNumber, cvv } = req.body;
        const userId = req.user?.id;

        if (!Array.isArray(items) || items.length === 0)
            return res.status(400).json({ error: 'Debes enviar al menos un tipo de boleta' });

        if (!cardNumber || !cvv)
            return res.status(400).json({ error: 'Datos de tarjeta requeridos' });

        const newPurchase = await purchaseService.createPurchase({ userId, eventId, items, cardNumber, cvv });
        res.status(201).json(newPurchase);

    } catch (err) {
        const mapped = {
            'Evento no encontrado': 404,
            'Tipo de ticket no encontrado': 404,
            'Evento no activo': 409,
            'Rol de usuario no valido para comprar': 403,
            'No hay suficientes tickets disponibles': 409,
            'Pago rechazado por la entidad bancaria': 402,
            'Error al procesar el pago': 502,
        };
        const status = mapped[err.message] ?? 500;
        res.status(status).json({ error: err.message });
    }
};

exports.updatePurchase = async (req, res) => {
    try {
        const purchaseUpdate = await purchaseService.updatePurchase(req.params.id);
        res.status(201).json({ purchaseUpdate });
    } catch (err) {
        if (err.message === 'Compra no encontrada')
            return res.status(404).json({ error: err.message });
        res.status(500).json({ error: err.message });
    }
};

exports.getMyPurchases = async (req, res) => {
    try {
        const purchases = await purchaseService.getMyPurchasesWithTickets(req.user.id);
        res.status(200).json(purchases);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};