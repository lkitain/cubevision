const express = require('express');
const pg = require('pg');

pg.defaults.ssl = true;

const router = express.Router();

// define the home page route
router.get('/', (request, response) => {
    pg.connect(process.env.DATABASE_URL, (connErr, client, done) => {
        client.query('select * from cubes;', (err, result) => {
            console.log(err);
            done();
            if (err) {
                response.send(`Error ${err}`);
            } else {
                response.send(result.rows);
            }
        });
    });
});

router.get('/:cubeId', (request, response) => {
    const cubeId = request.params.cubeId;
    const query = `select * from cube_cards join cubes using(cube_id) join cards using (card_id) where cube_id = ${cubeId};`;
    pg.connect(process.env.DATABASE_URL, (connErr, client, done) => {
        client.query(query, (err, result) => {
            done();
            if (err) {
                response.send(`Error ${err}`);
            } else {
                response.send(result.rows);
            }
        });
    });
});

module.exports = router;
