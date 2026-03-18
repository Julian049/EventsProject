const db = require('../database');

const getAll = () => db.any('SELECT * FROM categories WHERE status = true');
const getById = (id) => db.one('SELECT * FROM categories WHERE id = $(id)', {id});
const create = (category) => db.one(`
    INSERT INTO categories (name, description, status)
    VALUES ($(name), $(description), true)
    RETURNING *`, category);
const update = (newCategory, id) => db.one(`
    UPDATE categories
    SET name=$(name),
        description=$(description)
    WHERE id = $(id)
    RETURNING *`, {...newCategory, id});
const disable = (id) => db.one(`
    UPDATE categories
    SET status = false
    WHERE id = $(id)
    RETURNING *`, {id});

module.exports = {getAll, getById, create, update, disable};

