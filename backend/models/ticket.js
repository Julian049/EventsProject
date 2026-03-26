class Ticket {
    constructor({ id = null, purchaseId, qrCode, status = 'Active', createdAt = null }) {
        this.id = id;
        this.purchaseId = purchaseId;
        this.qrCode = qrCode;
        this.status = status;
        this.createdAt = createdAt;
    }
}

module.exports = Ticket;