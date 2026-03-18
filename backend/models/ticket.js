class Ticket {
    constructor({ id = null, purchase_id, qr_code, status = 'active', created_at = null }) {
        this.id = id;
        this.purchase_id = purchase_id;
        this.qr_code = qr_code;
        this.status = status;
        this.created_at = created_at;
    }
}

module.exports = Ticket;