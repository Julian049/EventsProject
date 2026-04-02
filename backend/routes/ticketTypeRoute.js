const express = require('express');
const router = express.Router();
const ticketTypeController = require('../controllers/ticketTypeController');

router.post('/create', ticketTypeController.createTicketType);
// router.post('/create', authentication.authenticateToken,ticketTypeController.createTicketType);
router.get('/all', ticketTypeController.getAllTicketTypes);
router.get('/:id', ticketTypeController.getById)

module.exports = router;