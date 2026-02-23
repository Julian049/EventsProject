const db = require('../database');

// const getAll = () => db.any('SELECT * FROM event LIMIT 1');
const getAll = () => db.any('SELECT * FROM event WHERE status = true');
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
                                WHERE id = $(id) RETURNING *`, {id});

const getById = (id) => db.one('SELECT * FROM event WHERE id = $(id)', {id});
module.exports = {getAll, create, update, disable, getById};