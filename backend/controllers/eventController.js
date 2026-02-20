const eventService = require('../services/eventService');

exports.createEvent = async (req, res) => {
    const newEvent = await eventService.createEvent(req.body);
    res.json(newEvent);
}

exports.viewEvents = async (req, res) => {
    const events = await eventService.viewEvents();
    res.json(events);
}

exports.updateEvent = async (req, res) => {
    const {id} = req.params;
    const newEvent = await eventService.updateEvent(req.body, id);
    res.json(newEvent);
}

exports.disableEvent = async (req, res) => {
    const {id} = req.params;
    const newEvent = await eventService.disableEvent(id);
    res.json(newEvent);
}