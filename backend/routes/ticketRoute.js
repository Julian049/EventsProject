const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');

router.post('/create', ticketController.createTicket);
router.get('/:id', ticketController.getById);
router.get('/purchase/:purchaseId', ticketController.getTicketsByPurchase);

module.exports = router;
