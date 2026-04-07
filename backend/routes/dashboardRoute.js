const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const authentication = require('../middlewares/authMiddleware');

router.get('/metrics', authentication.authenticateToken, authentication.adminAuthorized, dashboardController.getGlobalMetrics);
router.get('/sales-by-event', authentication.authenticateToken, authentication.adminAuthorized, dashboardController.getSalesByEvent);

module.exports = router;