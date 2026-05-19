const express = require('express');
const router = express.Router();
const purchaseController = require('../controllers/purchaseController');
const authentication = require("../middlewares/authMiddleware");
const logger = require('../utils/logger');

router.post(
    '/create/:id',
    authentication.authenticateToken,
    (req, res, next) => {
        logger.info(`[Compra] Usuario ID: ${req.user.id} Ruta: POST /create/${req.params.id} - Creando compra`);
        next();
    },
    purchaseController.createPurchase
);

router.patch(
    '/updateStatusToComplete/:id',
    authentication.authenticateToken,
    (req, res, next) => {
        logger.info(`[Compra] Usuario ID: ${req.user.id} Ruta: PATCH /updateStatusToComplete/${req.params.id} - Completando compra`);
        next();
    },
    purchaseController.updatePurchase
);

router.get(
    '/my-purchases',
    authentication.authenticateToken,
    (req, res, next) => {
        logger.info('Ruta: GET /my-purchases - Consultando historial de compras del usuario');
        next();
    },
    purchaseController.getMyPurchases
);

module.exports = router;