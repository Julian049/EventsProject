const db = require('../database');

const getById = (id) => db.oneOrNone('SELECT * FROM ticket_types WHERE id = $(id)', {id});
const create = (ticketType) => db.one(`
    INSERT INTO ticket_types (name)
    VALUES ($(name))
    RETURNING *`, ticketType);
const getAll = () => db.any('SELECT * FROM ticket_types');

module.exports = {getById, create, getAll};