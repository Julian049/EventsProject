const express = require('express');
const router = express.Router();
const ticketTypeController = require('../controllers/ticketTypeController');
const authentication = require("../middlewares/authMiddleware");

router.post('/create', authentication.authenticateToken, authentication.adminAuthorized, ticketTypeController.createTicketType);
router.get('/all', ticketTypeController.getAllTicketTypes);
router.get('/:id', ticketTypeController.getById)

module.exports = router;