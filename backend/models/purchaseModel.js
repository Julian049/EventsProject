const db = require('../database');

const getByUser = (user) => db.any('SELECT * FROM purchases WHERE user_id = $(user)', {user});
const getByEvent = (event) => db.any('SELECT * FROM purchases p, event_ticket_types et WHERE p.event_ticket_type_id = et.id AND et.event_id = $(event)', {event});
const getById = (id) => db.oneOrNone('SELECT * FROM purchases WHERE id = $(id)', {id});
const create = (purchase) => db.one(`INSERT INTO purchases (user_id, event_ticket_type_id, quantity, total_amount, status)
                                     VALUES ($(user_id), $(event_ticket_type_id), $(quantity), $(total_amount),
                                             $(status))
                                     RETURNING *`, purchase)

module.exports = {getByUser, getById, getByEvent, create};