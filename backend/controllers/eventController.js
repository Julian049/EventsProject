const eventService = require('../services/eventService');

exports.createEvent = async (req, res) => {
    const newEvent = await eventService.createEvent(req.body);
    res.json(newEvent);
}

exports.viewEvents = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const events = await eventService.viewEvents(page);
        res.json({
            page: page,
            data: events
        });
    } catch (err) {
        res.status(500).json({error: err.message});
    }
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

exports.getEventById = async (req, res) => {
    try {
        const {id} = req.params;
        const event = await eventService.getEventById(id);
        res.json(event);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: err.message});
    }
}

exports.interestEvent = async (req, res) => {
    try {
        const {id} = req.params;
        await eventService.interestEvent(id);
        res.json({message: "Interés registrado correctamente"});
    } catch (err) {
        console.error(err);
        res.status(500).json({error: err.message});
    }
}

exports.getAllInterest = async (req, res) => {
    try {
        const interests = await eventService.getAllInterest();
        res.json(interests);
    } catch (err) {
        console.log("Mori en controlador")
        res.status(500).json({error: err.message});
    }
}