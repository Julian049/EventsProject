class Event {
    constructor(name, date, description, image, category, price) {
        this.name = name;
        this.date = date;
        this.description = description;
        this.image = image;
        this.category = category;
        this.price = price;
    }
}

module.exports = Event;