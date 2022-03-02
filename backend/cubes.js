const express = require('express');
const pg = require('pg');

const {
    addCardToCube,
    findOrCreateCard,
} = require('./postgres');

pg.defaults.ssl = true;

const router = express.Router();

function pool() {
    return new pg.Pool({
        connectionString: process.env.DATABASE_URL || 'postgresql://ianhook@localhost:5432/ianhook',
        ssl: process.env.DATABASE_URL ? true : false,
    });
}

// define the home page route
router.get('/', (request, response) => {
    console.log(process.env.DATABASE_URL);
    pool().connect((connErr, client, done) => {
        console.log(connErr);
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

// router.post('/postcube', (request, response) => {
//     console.log(request.body);
//     const cards = request.body.cards.split('\n').filter(name => name.length > 0);
//     const out = [];
//     pool().connect((connErr, client, done) => {
//         Promise.all(
//             cards.map(name => new Promise((resolve) => {
//                 findOrCreateCard(name, client, (id) => {
//                     out.push(id);
//                     resolve();
//                 });
//             })),
//         )
//             .then(() => Promise.all(
//                 out.map(cardId => addCardToCube(request.body.cube, cardId, client)),
//             ))
//             .then(() => {
//                 done();
//                 response.json(out);
//             });
//     });
// });

router.get('/cards', (request, response) => {
    const query = 'select * from cube_card_hash';
    pool().connect((connErr, client, done) => {
        console.log(connErr);
        client.query(query, (err, result) => {
            if (err) {
                response.send(`Error ${err}`);
            } else {
                const link = [];
                result.rows.forEach((row) => row.card_ids.forEach((card_id) => {
                    link.push({ cube_id: row.cube_id, card_id });
                }));
                response.send(link);
            }
            done();
        });
    });
});

router.get('/:cubeId', (request, response) => {
    const { cubeId } = request.params;
    const query = `select * from cube_cards join cubes using(cube_id) join cards using (card_id) where cube_id = ${cubeId};`;
    pool().connect((connErr, client, done) => {
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
