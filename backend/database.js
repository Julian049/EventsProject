require('dotenv').config();
const pgp = require('pg-promise')();

const db = pgp({
    host:     process.env.DB_HOST,
    port:     process.env.DB_PORT,
    database: process.env.POSTGRES_DB,
    user:     process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD
});

module.exports = db;