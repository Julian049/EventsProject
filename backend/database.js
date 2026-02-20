const pgp = require('pg-promise')();

const db = pgp('postgresql://julian:postgres@172.31.88.36:5432/eventtestdb');

module.exports = db;