const db = require('../database');

const getAll = () => db.any('SELECT * FROM event LIMIT 1');
const create = (event) => db.one(`INSERT INTO event (name, date, description, image, category, price, status)
                                  VALUES ($(name), $(date), $(description), $(image), $(category),
                                          $(price), true)
                                  RETURNING *`, event)
const update = (newEvent, id) => db.one(`UPDATE event
                                         SET name=$(name),
                                             date=$(date),
                                             description=$(description),
                                             image=$(image),
                                             category=$(category),
                                             price=$(price)
                                         WHERE id = $(id)
                                         RETURNING *`, {...newEvent, id});
const disable = (id) => db.one(`UPDATE event
                                SET status= false
                                WHERE id = $(id) RETURNING *`, {id});

module.exports = {getAll, create, update, disable};