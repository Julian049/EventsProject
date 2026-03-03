const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const {getById} = require("../models/eventModel");

router.post('/create', eventController.createEvent);
router.get('/', eventController.viewEvents);
router.put('/update/:id',eventController.updateEvent);
router.patch('/disable/:id',eventController.disableEvent);
router.patch('/interested/:id', eventController.interestEvent);
router.get("/getAllInterested", eventController.getAllInterest);
router.get('/:id', eventController.getEventById);

router.post('/:id/favorite',           eventController.addFavorite);
router.delete('/:id/favorite',         eventController.removeFavorite);
router.get('/favorites/user/:userId',  eventController.getFavoritesByUser);
router.get('/favorites/report',        eventController.getFavoritesReport);

module.exports = router;