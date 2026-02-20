class Event {
    constructor({name, date = null, description = null, image = null, category = null, price = null}) {
        this.name = name;
        this.date = date;
        this.description = description;
        this.image = image;
        this.category = category;
        this.price = price;
    }
}

module.exports = Event;