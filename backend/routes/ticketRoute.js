const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');
const authentication = require("../middlewares/authMiddleware");

router.post('/create',authentication.authenticateToken, authentication.adminAuthorized, ticketController.createTicket);
router.get('/:id', authentication.authenticateToken, ticketController.getById);
router.get('/purchase/:purchaseId', authentication.authenticateToken, ticketController.getTicketsByPurchase);

module.exports = router;
