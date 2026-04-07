const Event = require('../models/event');
const EventModel = require('../models/eventModel');

exports.createEvent = (event) => {
    const newEvent = new Event(event);
    return EventModel.create(newEvent)
}

exports.viewActiveEvents = async (page) => {
    const limit = 10;
    const offset = (page - 1) * limit;
    return EventModel.getActive(limit, offset);
}

exports.viewAllEvents = async (page) => {
    const limit = 10;
    const offset = (page - 1) * limit;
    return EventModel.getAll(limit, offset);
}

exports.updateEvent = async (newEvent, id) => {
    const current = await EventModel.getById(id);
    const eventToUpdate = {
        ...current,
        ...newEvent,
        status: newEvent.status || current.status 
    };
    return EventModel.update(eventToUpdate, id);
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


exports.getAllInterest = () =>{
    return EventModel.getAllInterests();
}

exports.addFavorite = (userId, eventId) => 
    EventModel.addFavorite(userId, eventId);

exports.removeFavorite = (userId, eventId) => 
    EventModel.removeFavorite(userId, eventId);


exports.getFavoritesByUser = (userId) => 
    EventModel.getFavoritesByUser(userId);

exports.getFavoritesReport = () => 
    EventModel.getFavoritesReport();