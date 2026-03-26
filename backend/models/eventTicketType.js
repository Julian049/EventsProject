class EventTicketType {
    constructor({id = null, eventId, price, totalQuantity, availableQuantity = null, ticketTypeId}) {
        this.id = id;
        this.eventId = eventId;
        this.price = price;
        this.totalQuantity = totalQuantity;
        this.availableQuantity = availableQuantity;
        this.ticketTypeId = ticketTypeId;
    }
}

module.exports = EventTicketType;