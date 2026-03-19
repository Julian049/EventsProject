const db = require('../database');

const getById = (id) => db.oneOrNone('SELECT * FROM event_ticket_types WHERE id = $(id)', {id});
const create = (eventTicketType) => db.one(`
    INSERT INTO event_ticket_types (event_id, price, total_quantity, available_quantity, ticket_type_id)
    VALUES ($(event_id), $(price), $(total_quantity), $(available_quantity), $(ticket_type_id))
    RETURNING *`, eventTicketType);

module.exports = {getById, create};