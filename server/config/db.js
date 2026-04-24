const { Pool } = require("pg");

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "dsa_checklist",
    password: "9981892028",
    port: 5432,
});

module.exports = pool;