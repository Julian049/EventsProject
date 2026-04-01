const db = require('../database');

const getAll = () => db.any('SELECT * FROM users WHERE status = true');
const create = (user) => db.one(`INSERT INTO users (name, email, password, role)
                                 VALUES ($(name), $(email), $(password), $(role)) RETURNING *`, user)
const update = (newUser, id) => db.one(`UPDATE users
                                        SET name=$(name),
                                            email=$(email),
                                            password=$(password),
                                            role=$(role)
                                        WHERE id = $(id) RETURNING *`, {...newUser, id});
const getById = (id) => db.one('SELECT * FROM users WHERE id = $(id) AND status = true', {id});
const getByEmail = (email) => db.oneOrNone('SELECT * FROM users WHERE email = $(email)', {email});
const remove = (id) => db.oneOrNone('UPDATE users SET status = false WHERE id = $(id) RETURNING *', {id});
module.exports = {getAll, create, update, getById, getByEmail, remove};