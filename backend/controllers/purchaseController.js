const purchaseService = require('../services/purchaseService');
const logger = require('../utils/logger');

exports.createPurchase = async (req, res) => {
    const eventId = parseInt(req.params.id);
    const userId = req.user?.id;

    logger.info(`[Controller] [createPurchase] Iniciando proceso de compra para Usuario ID: ${userId} en Evento ID: ${eventId}`);

    try {
        const { items, cardNumber, cvv } = req.body;

        if (!Array.isArray(items) || items.length === 0) {
            logger.warn(`[Controller] [createPurchase] Validación fallida: El usuario ${userId} envió una lista de ítems vacía o inválida`);
            return res.status(400).json({ error: 'Debes enviar al menos un tipo de boleta' });
        }

        if (!cardNumber || !cvv) {
            logger.warn(`[Controller] [createPurchase] Validación fallida: El usuario ${userId} no envió los datos completos de la tarjeta`);
            return res.status(400).json({ error: 'Datos de tarjeta requeridos' });
        }

        logger.info(`[Controller] [createPurchase] Enviando datos al servicio para procesar el pago y reserva (Tickets: ${items.length})`);
        const newPurchase = await purchaseService.createPurchase({ userId, eventId, items, cardNumber, cvv });

        logger.info(`[Controller] [createPurchase] Compra creada con éxito. ID de transacción/compra: ${newPurchase.id || 'Generada'}`);
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

        if (status >= 500) {
            logger.error(`[Controller] [createPurchase] [CRÍTICO] Fallo inesperado en el servidor para Usuario ${userId}: ${err.message}`);
        } else {
            logger.warn(`[Controller] [createPurchase] No se pudo completar la compra para Usuario ${userId}. Razón: "${err.message}" (Status: ${status})`);
        }

        res.status(status).json({ error: err.message });
    }
};

exports.updatePurchase = async (req, res) => {
    const purchaseId = req.params.id;
    logger.info(`[Controller] [updatePurchase] Solicitud para actualizar estado a COMPLETADO para la compra ID: ${purchaseId}`);

    try {
        const purchaseUpdate = await purchaseService.updatePurchase(purchaseId);

        logger.info(`[Controller] [updatePurchase] Compra ID: ${purchaseId} actualizada correctamente`);
        res.status(201).json({ purchaseUpdate });
    } catch (err) {
        if (err.message === 'Compra no encontrada') {
            logger.warn(`[Controller] [updatePurchase] Intento de actualización fallido: La compra ID ${purchaseId} no existe`);
            return res.status(404).json({ error: err.message });
        }

        logger.error(`[Controller] [updatePurchase] Error interno al actualizar compra ID ${purchaseId}: ${err.message}`);
        res.status(500).json({ error: err.message });
    }
};

exports.getMyPurchases = async (req, res) => {
    const userId = req.user?.id;
    logger.info(`[Controller] [getMyPurchases] Usuario ID: ${userId} solicitando su historial de compras`);

    try {
        const purchases = await purchaseService.getMyPurchasesWithTickets(userId);

        logger.info(`[Controller] [getMyPurchases] Historial devuelto con éxito para Usuario ID: ${userId} (${purchases.length} registros encontrados)`);
        res.status(200).json(purchases);
    } catch (err) {
        logger.error(`[Controller] [getMyPurchases] Error al obtener compras del Usuario ID ${userId}: ${err.message}`);
        res.status(500).json({ error: err.message });
    }
};