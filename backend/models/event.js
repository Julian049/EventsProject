class Event {
    constructor({name, date = null, description = null, image = null, category_id = null, price = null}) {
        this.name = name;
        this.date = date;
        this.description = description;
        this.image = image;
        this.category_id = category_id;
        this.price = price;
    }
}

module.exports = Event;