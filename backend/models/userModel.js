const db = require('../database');

const getAll = () => db.any('SELECT * FROM users');
const create = (user) => db.one(`INSERT INTO users (name, email, password, role)
                                 VALUES ($(name), $(email), $(password), $(role)) RETURNING *`, user)
const update = (newUser, id) => db.one(`UPDATE users
                                        SET name=$(name),
                                            email=$(email),
                                            password=$(password),
                                            role=$(role)
                                        WHERE id = $(id) RETURNING *`, {...newUser, id});
const getById = (id) => db.one('SELECT * FROM users WHERE id = $(id)', {id});
module.exports = {getAll, create, update, getById};