const db = require('../database');

const getAll = () => db.any('SELECT * FROM event LIMIT 1');
const create = (event) => db.one(`INSERT INTO event (name, date, description, image, category, price)
                                  VALUES ($(name), $(date), $(description), $(image), $(category),
                                          $(price)) RETURNING *`, event)

module.exports = {getAll, create};