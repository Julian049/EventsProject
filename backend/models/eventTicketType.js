class EventTicketType {
    constructor({ id = null, event_id, name, description = null, price, total_quantity, available_quantity = null }) {
        this.id = id;
        this.event_id = event_id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.total_quantity = total_quantity;
        this.available_quantity = available_quantity ?? total_quantity;
    }
}

module.exports = EventTicketType;