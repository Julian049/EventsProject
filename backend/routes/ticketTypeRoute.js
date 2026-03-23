const express = require('express');
const router = express.Router();
const ticketTypeController = require('../controllers/ticketTypeController');
const authentication = require("../middlewares/authMiddleware");

router.post('/create', ticketTypeController.createTicketType);
// router.post('/create', authentication.authenticateToken,ticketTypeController.createTicketType);

module.exports = router;