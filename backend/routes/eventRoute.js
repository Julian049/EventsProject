const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

router.post('/create', eventController.createEvent);
router.get('/', eventController.viewEvents);
router.put('/update/:id',eventController.updateEvent);
router.patch('/disable/:id',eventController.disableEvent);
router.get('/:id', eventController.getEventById);

module.exports = router;