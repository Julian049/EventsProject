const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const {getById} = require("../models/eventModel");
const authentication = require("../middlewares/authMiddleware");

router.post('/create', authentication.authenticateToken, authentication.adminAuthorized, eventController.createEvent);
router.get('/', eventController.viewActiveEvents);
router.get('/all', eventController.viewAllEvents);
router.put('/update/:id', authentication.authenticateToken, authentication.adminAuthorized, eventController.updateEvent);
router.patch('/disable/:id', authentication.authenticateToken, authentication.adminAuthorized, eventController.disableEvent);
router.patch('/interested/:id', eventController.interestEvent);
router.get("/getAllInterested", authentication.authenticateToken, authentication.adminAuthorized, eventController.getAllInterest);
router.get('/:id', eventController.getEventById);

router.post('/:id/favorite', eventController.addFavorite);
router.delete('/:id/favorite', eventController.removeFavorite);
router.get('/favorites/user/:userId', eventController.getFavoritesByUser);
router.get('/favorites/report', authentication.authenticateToken, authentication.adminAuthorized, eventController.getFavoritesReport);

module.exports = router;