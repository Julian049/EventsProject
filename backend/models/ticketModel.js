const db = require('../database');

const getTicketsByPurchase = (purchaseId) => db.any('SELECT * FROM tickets WHERE purchase_id = $(purchaseId)', {purchaseId});
const getById = (id) => db.oneOrNone('SELECT * FROM tickets WHERE id = $(id)', {id});
const create = (ticket, t = db) =>
    (t).one(
        'INSERT INTO tickets (purchase_id, qr_code) VALUES ($(purchaseId), $(qrCode)) RETURNING *',
        ticket
    );
module.exports = {getTicketsByPurchase, getById, create};