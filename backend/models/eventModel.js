const db = require('../database');

const getAll = (limit, offset) =>
    db.any('SELECT * FROM event WHERE status = true ORDER BY id LIMIT $1 OFFSET $2', [limit, offset]);
const create = (event) => db.one(`INSERT INTO event (name, date, description, image, category_id, price, status)
                                  VALUES ($(name), $(date), $(description), $(image), $(category_id),
                                          $(price), true)
                                  RETURNING *`, event)
const update = (newEvent, id) => db.one(`UPDATE event
                                         SET name=$(name),
                                             date=$(date),
                                             description=$(description),
                                             image=$(image),
                                             category_id=$(category_id),
                                             price=$(price)
                                         WHERE id = $(id)
                                         RETURNING *`, {...newEvent, id});
const disable = (id) => db.one(`UPDATE event
                                SET status= false
                                WHERE id = $(id)
                                RETURNING *`, {id});

const getById = (id) => db.one('SELECT * FROM event WHERE id = $(id)', {id});
const interest = (id) => db.none("INSERT INTO interaction (event_id, type) VALUES ($1, 'click')", [id])
const getAllInterests = () => db.any('SELECT * FROM interaction');
module.exports = {getAll, create, update, disable, getById, interest, getAllInterests};