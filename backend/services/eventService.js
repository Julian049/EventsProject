const Event = require('../models/event');
const EventModel = require('../models/eventModel');


const event1 = new Event({name: "Evento 1"});
const event2 = new Event({name: "Evento 2"});

const events = [event1, event2]

exports.createEvent = (event) => {
    const newEvent = new Event(event);
    return EventModel.create(newEvent)
}

exports.viewEvents = async (page) => {
    const limit = 10;
    const offset = (page - 1) * limit;
    return EventModel.getAll(limit, offset);
}

exports.updateEvent = (newEvent,id) => {
    return EventModel.update(newEvent,id);
}

exports.disableEvent = (id) => {
    return EventModel.disable(id);
}

exports.getEventById = (id) => {
    return EventModel.getById(id);
}

exports.interestEvent = (id) => {
    return EventModel.interest(id);
}