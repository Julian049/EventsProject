class EventTicketType {
    constructor({ id = null, event_id = null, price, total_quantity, available_quantity = null, ticket_type }) {
        this.id = id;
        this.event_id = event_id;
        this.price = price;
        this.total_quantity = total_quantity;
        this.available_quantity = available_quantity ?? total_quantity;
        this.ticket_type = ticket_type;
    }
}

module.exports = EventTicketType;