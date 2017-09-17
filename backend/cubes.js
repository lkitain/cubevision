const express = require('express');
const pg = require('pg');

const {
    addCardToCube,
    findOrCreateCard,
} = require('./postgres');

pg.defaults.ssl = true;

const router = express.Router();

// define the home page route
router.get('/', (request, response) => {
    const pool = new pg.Pool({
        connectionString: process.env.DATABASE_URL,
    });
    pool.connect((connErr, client, done) => {
        client.query('select * from cubes;', (err, result) => {
            if (err) {
                response.send(`Error ${err}`);
            } else {
                response.send(result.rows);
            }
            done();
        });
    });
});

router.post('/postcube', (request, response) => {
    console.log(request.body);
    const pool = new pg.Pool({
        connectionString: process.env.DATABASE_URL,
    });
    const cards = request.body.cards.split('\n');
    const out = [];
    pool.connect((connErr, client, done) => {
        Promise.all(
            cards.map(name => new Promise((resolve) => {
                findOrCreateCard(name, client, (id) => {
                    out.push(id);
                    resolve();
                });
            }))
        ).then(() =>
            Promise.all(
                out.map(cardId => new Promise((resolve) => {
                    addCardToCube(request.body.name, cardId, client, resolve);
                }))
            )
        )
        .then(() => {
            done();
            response.json(out);
        });
    });
});

router.get('/cards', (request, response) => {
    const pool = new pg.Pool({
        connectionString: process.env.DATABASE_URL,
    });
    const query = 'select * from cube_cards';
    pool.connect((connErr, client, done) => {
        console.log(connErr);
        client.query(query, (err, result) => {
            if (err) {
                response.send(`Error ${err}`);
            } else {
                response.send(result.rows);
            }
            done();
        });
    });
});

router.get('/:cubeId', (request, response) => {
    const cubeId = request.params.cubeId;
    const pool = new pg.Pool({
        connectionString: process.env.DATABASE_URL,
    });
    const query = `select * from cube_cards join cubes using(cube_id) join cards using (card_id) where cube_id = ${cubeId};`;
    pool.connect((connErr, client, done) => {
        console.log(connErr);
        client.query(query, (err, result) => {
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
