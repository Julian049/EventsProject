const db = require('../database');

const getGlobalMetrics = () => db.one(`
    SELECT
        (SELECT COUNT(*) FROM users WHERE status = true)                    AS "totalUsers",
        (SELECT COUNT(*) FROM events WHERE status != 'Inactive')            AS "totalEvents",
        (SELECT COALESCE(SUM(total_amount), 0) FROM purchases)              AS "totalRevenue",
        (SELECT COUNT(*) FROM purchases)                                    AS "totalPurchases",
        (SELECT COUNT(*) FROM tickets)                                      AS "totalTickets"
`);

const getSalesByEvent = () => db.any(`
    SELECT
        e.id                            AS "eventId",
        e.name                          AS "eventName",
        e.date                          AS "eventDate",
        tt.name                         AS "ticketType",
        SUM(p.quantity)                 AS "ticketsSold",
        SUM(p.total_amount)             AS "totalRevenue"
    FROM events e
    JOIN event_ticket_types ett ON e.id = ett.event_id
    JOIN ticket_types tt ON ett.ticket_type_id = tt.id
    JOIN purchases p ON ett.id = p.event_ticket_type_id
    GROUP BY e.id, e.name, e.date, tt.name
    ORDER BY e.id
`);

module.exports = { getGlobalMetrics, getSalesByEvent };