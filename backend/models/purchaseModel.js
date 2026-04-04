const db = require('../database');

const getByUser = (userId) => db.any('SELECT * FROM purchases WHERE user_id = $(userId)', {userId});
const getById = (id) => db.oneOrNone('SELECT * FROM purchases WHERE id = $(id)', {id});
const create = (purchase) => db.one(`INSERT INTO purchases (user_id, event_ticket_type_id, quantity, total_amount)
                                     VALUES ($(userId), $(eventTicketTypeId), $(quantity), $(totalAmount))
                                     RETURNING
                                         id,
                                         user_id AS "userId",
                                         event_ticket_type_id AS "eventTicketTypeId",
                                         quantity,
                                         total_amount AS "totalAmount",
                                         status,
                                         created_at AS "createdAt"`, purchase)
const getAll = () => db.any('SELECT * FROM purchases');
const updateStatusToComplete = (id) => db.one('UPDATE purchases SET status = \'Completed\' WHERE id = $(id) RETURNING *', {id})

module.exports = {getByUser, getById, getAll, create, updateStatusToComplete};