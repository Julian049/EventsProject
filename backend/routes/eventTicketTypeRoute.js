const express = require('express');
const router = express.Router();
const eventTicketTypeController = require('../controllers/eventTicketTypeController');
const authentication = require("../middlewares/authMiddleware");

router.post('/create', authentication.authenticateToken, authentication.adminAuthorized, eventTicketTypeController.createEventTicketType);
router.get('/all/:eventId', eventTicketTypeController.getAllTicketTypes);
router.get('/:eventId/:ticketId', eventTicketTypeController.getTicketTypeByIds);
router.patch('/:eventId/:ticketTypeId/quantity', authentication.authenticateToken, authentication.adminAuthorized, eventTicketTypeController.updateAvailableQuantity);
router.put('/:eventId/:ticketTypeId',authentication.authenticateToken, authentication.adminAuthorized, eventTicketTypeController.updateTicketType);
router.delete('/:eventId/:ticketTypeId',authentication.authenticateToken, authentication.adminAuthorized, eventTicketTypeController.deleteTicketType);

module.exports = router;

