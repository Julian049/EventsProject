const db = require('../database');

const getActive = (limit, offset) =>
    db.any('SELECT * FROM events WHERE status = true ORDER BY id LIMIT $1 OFFSET $2', [limit, offset]);

const getAll = (limit, offset) =>
    db.any('SELECT * FROM events ORDER BY id LIMIT $1 OFFSET $2', [limit, offset]);

const create = (event) => db.one(`INSERT INTO events (name, date, description, image, category_id, price, status)
                                  VALUES ($(name), $(date), $(description), $(image), $(category_id),
                                          $(price), true)
                                  RETURNING *`, event)
const update = (newEvent, id) => db.one(`UPDATE events
                                         SET name=$(name),
                                             date=$(date),
                                             description=$(description),
                                             image=$(image),
                                             category_id=$(category_id),
                                             price=$(price)
                                         WHERE id = $(id)
                                         RETURNING *`, {...newEvent, id});
const disable = (id) => db.one(`UPDATE events
                                SET status= false
                                WHERE id = $(id)
                                RETURNING *`, {id});

const getById = (id) => db.one('SELECT * FROM events WHERE id = $(id)', {id});
const interest = (id) => db.none("INSERT INTO interaction (event_id, type) VALUES ($1, 'click')", [id])
const getAllInterests = () => db.any('SELECT * FROM interaction');

const addFavorite    = (userId, eventId) => 
    db.none('INSERT INTO favorites (user_id, event_id) VALUES ($1, $2)', [userId, eventId]);

const removeFavorite = (userId, eventId) => 
    db.none('DELETE FROM favorites WHERE user_id = $1 AND event_id = $2', [userId, eventId]);

const getFavoritesByUser = (userId) => 
    db.any('SELECT e.* FROM events e JOIN favorites f ON e.id = f.event_id WHERE f.user_id = $1', [userId]);

const getFavoritesReport = () =>
    db.any(`
        SELECT e.id, e.name, COUNT(f.id) AS total_favorites
        FROM events e
        LEFT JOIN favorites f ON e.id = f.event_id
        GROUP BY e.id, e.name
        ORDER BY total_favorites DESC
    `);

module.exports = { getAll, getActive, create, update, disable, getById, interest, getAllInterests,
                   addFavorite, removeFavorite, getFavoritesByUser, getFavoritesReport };