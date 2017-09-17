const express = require('express');
const pg = require('pg');

pg.defaults.ssl = true;

const router = express.Router();

// define the home page route
router.get('/', (request, response) => {
    const pool = new pg.Pool({
        connectionString: process.env.DATABASE_URL,
    });
    pool.connect((connErr, client, done) => {
        client.query('select * from cards;', (err, result) => {
            if (err) {
                response.send(`Error ${err}`);
            } else {
                response.send(result.rows);
            }
            done();
        });
    });
});

module.exports = router;
