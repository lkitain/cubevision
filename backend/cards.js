const express = require('express');
const pg = require('pg');
const mtg = require('mtgsdk');

const {
    acquireCard,
} = require('./postgres');

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

router.post('/acquire', (request, response) => {
    return;
    const pool = new pg.Pool({
        connectionString: process.env.DATABASE_URL,
    });
    const cardId = request.body.cardId;
    pool.connect((connErr, client, done) => {
        acquireCard(cardId, client, () => {
            response.send(true);
            done();
        });
    });
});

router.get('/update', (request, response) => {
    const pool = new pg.Pool({
        connectionString: process.env.DATABASE_URL,
    });
    pool.connect((connErr, client, done) => {
        client.query('select * from cards where multiverse_id is null limit 30;', (err, result) => {
            if (err) {
                response.send(`Error ${err}`);
            } else {
                const found = [];
                Promise.all(result.rows.map((row) => {
                    const splitName = row.name.split(' // ')[0];
                    return mtg.card
                        .where({ name: splitName })
                        .then((cards) => {
                            console.log(cards.length);
                            console.log(row.name);
                            let card = null;
                            cards.forEach((c) => {
                                if (c.name === row.name) {
                                    card = c;
                                }
                            });
                            console.log(card.name);
                            found.push(row);

                            let colors = 'C';
                            if (Object.hasOwnProperty.call(card, 'colors')) {
                                colors = card.colors.reduce((out, c) => `${out}${c[0]}`, '');
                            }

                            client.query(
                                'update cards set cmc = $1, mana_cost = $2, reserved = $3, color = $5, types = $6, multiverse_id = $7 where card_id = $4',
                                [card.cmc, card.manaCost, card.reserved || false, row.card_id, colors, card.types.join(','), card.multiverseid],
                                (inErr) => {
                                    if (inErr) {
                                        throw new Error(inErr);
                                    }
                                }
                            );
                            // console.log(query);
                        });
                })).then(() => response.send(found));
            }
            done();
        });
    });
});

module.exports = router;
