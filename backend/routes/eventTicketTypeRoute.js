const express = require('express');
const router = express.Router();
const eventTicketTypeController = require('../controllers/eventTicketTypeController');
const authentication = require("../middlewares/authMiddleware");

router.post('/create', eventTicketTypeController.createEventTicketType);
router.get('/all/:eventId', eventTicketTypeController.getAllTicketTypes);
router.get('/:eventId/:ticketId', eventTicketTypeController.getTicketTypeByIds);
router.patch('/:eventId/:ticketTypeId/quantity', eventTicketTypeController.updateAvailableQuantity);
router.put('/:eventId/:ticketTypeId', eventTicketTypeController.updateTicketType);
router.delete('/:eventId/:ticketTypeId', eventTicketTypeController.deleteTicketType);

module.exports = router;
