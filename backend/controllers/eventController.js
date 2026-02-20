const eventService = require('../services/eventService');

exports.createEvent = async (req, res) => {
    const newEvent = await eventService.createEvent(req.body);
    res.json(newEvent);
}

exports.viewEvents = async (req, res) => {
    const events = await eventService.viewEvents();
    res.json(events);
}