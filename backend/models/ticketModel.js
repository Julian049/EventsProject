const db = require('../database');

const getByPurchase = (purchase) => db.any('SELECT * FROM tickets t,purchases p, event_ticket_types et, ticket_types tt, events e WHERE t.purchase_id = $(purchase) AND t.purchase_id = p.id AND p.event_ticket_type_id = et.id AND et.ticket_type_id = tt.id AND et.event_id = e.id;', {purchase});
const getById = (id) => db.oneOrNone('SELECT * FROM tickets WHERE id = $(id)', {id});

module.exports = {getByPurchase,getById};