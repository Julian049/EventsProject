const eventService = require('../services/eventService');

exports.createEvent = (req, res) => {
    const event = req.body;
    const newEvent = eventService.createEvent()
    res.json(newEvent);
}

exports.viewEvents = (req, res) => {
    res.json(eventService.viewEvents());
}