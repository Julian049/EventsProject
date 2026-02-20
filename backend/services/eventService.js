const Event = require('../models/event');


const event1 = new Event();
const event2 = new Event("Evento 1");

const events = [event1,event2]

exports.createEvent = () => {

}

exports.viewEvents = () => {
    return events
}