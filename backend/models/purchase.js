class Purchase {
    constructor({ id = null, userId, eventTicketTypeId, quantity, totalAmount, status = 'pending', createdAt = null }) {
        this.id = id;
        this.userId = userId;
        this.eventTicketTypeId = eventTicketTypeId;
        this.quantity = quantity;
        this.totalAmount = totalAmount;
        this.status = status;
        this.createdAt = createdAt;
    }
}

module.exports = Purchase;