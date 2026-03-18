const db = require('../database');

const getByUser = (user) => db.any('SELECT * FROM purchases WHERE user_id = $(user)', {user});
const getByEvent = (event) => db.any('SELECT * FROM purchases p, event_ticket_types et WHERE p.event_ticket_type_id = et.id AND et.event_id = $(event)', {event});
const getById = (id) => db.oneOrNone('SELECT * FROM purchases WHERE id = $(id)', {id});
const create = ({user_id, event_ticket_type_id, quantity, total_amount}) =>
    db.tx(async (t) => {
        await t.none(
            `UPDATE event_ticket_types
             SET available_quantity = available_quantity - $(quantity)
             WHERE id = $(event_ticket_type_id)`,
            {quantity, event_ticket_type_id}
        );

        const purchase = await t.one(
            `INSERT INTO purchases (user_id, event_ticket_type_id, quantity, total_amount, status)
             VALUES ($(user_id), $(event_ticket_type_id), $(quantity), $(total_amount), 'Completed')
             RETURNING *`,
            {user_id, event_ticket_type_id, quantity, total_amount}
        );

        const tickets = await t.many(
            `INSERT INTO tickets (purchase_id, qr_code, status)
             SELECT $(purchase_id), gen_random_uuid()::text, 'Active'
             FROM generate_series(1, $(quantity))
             RETURNING *`,
            {purchase_id: purchase.id, quantity}
        );

        return {purchase, tickets};
    });

module.exports = {getByUser, getById, getByEvent, create};