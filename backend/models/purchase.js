class Purchase {
    constructor({ id = null, user_id, event_ticket_type_id, quantity, total_amount, status = 'pending', created_at = null }) {
        this.id = id;
        this.user_id = user_id;
        this.event_ticket_type_id = event_ticket_type_id;
        this.quantity = quantity;
        this.total_amount = total_amount;
        this.status = status;
        this.created_at = created_at;
    }
}

module.exports = Purchase;