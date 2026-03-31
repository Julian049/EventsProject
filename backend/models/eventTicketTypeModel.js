const db = require('../database');
const getByIds = (eventId, ticketTypeId) =>
    db.oneOrNone(`
    SELECT
      id,
      event_id AS "eventId",
      price,
      total_quantity AS "totalQuantity",
      available_quantity AS "availableQuantity",
      ticket_type_id AS "ticketTypeId"
    FROM event_ticket_types
    WHERE event_id = $(eventId)
      AND ticket_type_id = $(ticketTypeId);
  `, { eventId, ticketTypeId });
const getTicketTypesByEventId = (eventId) => db.any('SELECT * FROM event_ticket_types et, ticket_types tt WHERE event_id = $(eventId) AND et.ticket_type_id = tt.id;', {eventId});
const create = (eventTicketType) => db.one(`
    INSERT INTO event_ticket_types (event_id, price, total_quantity, available_quantity, ticket_type_id)
    VALUES ($(eventId), $(price), $(totalQuantity), $(availableQuantity), $(ticketTypeId))
    RETURNING *`, eventTicketType);
const updateAvailableQuantity = (eventId, ticketTypeId, newQuantity) => db.one(`
    UPDATE event_ticket_types
    SET available_quantity = $(newQuantity)
    WHERE event_id = $(eventId)
      AND ticket_type_id = $(ticketTypeId)
    RETURNING *`, {eventId, ticketTypeId, newQuantity});
const updateTicketType = (eventId, ticketTypeId, totalQuantity, availableQuantity, price) => db.one(`
    UPDATE event_ticket_types
    SET total_quantity     = $(totalQuantity),
        available_quantity = $(availableQuantity),
        price              = $(price)
    WHERE event_id = $(eventId)
      AND ticket_type_id = $(ticketTypeId)
    RETURNING *`, {eventId, ticketTypeId, totalQuantity, availableQuantity, price});
const deleteTicketType = (eventId, ticketTypeId) => db.one(`
    DELETE
    FROM event_ticket_types
    WHERE event_id = $(eventId)
      AND ticket_type_id = $(ticketTypeId) RETURNING *;`, {eventId, ticketTypeId});

module.exports = {
    getByIds,
    getTicketTypesByEventId,
    create,
    updateAvailableQuantity,
    updateTicketType,
    deleteTicketType
};