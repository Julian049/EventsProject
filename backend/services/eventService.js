const Event = require('../models/event');
const EventModel = require('../models/eventModel');


const event1 = new Event({name: "Evento 1"});
const event2 = new Event({name: "Evento 2"});

const events = [event1, event2]

exports.createEvent = (event) => {
    const newEvent = new Event(event);
    return EventModel.create(newEvent)
}

exports.viewEvents = async () => {
    console.log('view events');
    console.log(await EventModel.getAll());
    return EventModel.getAll()
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