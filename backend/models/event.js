class Event {
    constructor({name, date = null, description = null, image = null, category_id = null, price = null, status = 'Active'}) {
        this.name = name;
        this.date = date;
        this.description = description;
        this.image = image;
        this.category_id = category_id;
        this.price = price;
        this.status = status;
    }
}

module.exports = Event;