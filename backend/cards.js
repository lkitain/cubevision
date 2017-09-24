const express = require('express');
const pg = require('pg');
const mtg = require('mtgsdk');

const {
    acquireCard,
    addCardToCube,
    checkCardInCube,
    removeCardFromCube,
    startTransaction,
    commitTransaction,
    rollbackTransaction,
} = require('./postgres');
const constants = require('../ui/consts');

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


router.post('/replace', (request, response) => {
    const pool = new pg.Pool({
        connectionString: process.env.DATABASE_URL,
    });
    const newCardId = request.body.newCardId;
    const oldCardId = request.body.oldCardId;
    pool.connect((connErr, client, done) => {
        Promise.all([
            checkCardInCube(newCardId, constants.OUR_BINDER),
            checkCardInCube(oldCardId, constants.OUR_CUBE),
        ])
            .then(() => startTransaction(client))
            .then(Promise.all([
                addCardToCube(constants.OUR_CUBE, newCardId, client),
                addCardToCube(constants.OUR_BINDER, oldCardId, client),
                removeCardFromCube(constants.OUR_BINDER, newCardId, client),
                removeCardFromCube(constants.OUR_CUBE, oldCardId, client),
            ]))
            .then(() => commitTransaction(client))
            .catch((err) => {
                console.log(err);
                return rollbackTransaction(client);
            })
            .then((json) => {
                response.send(json);
                done();
            });
    });
});

router.get('/update', (request, response) => {
    console.log('asdf');
    const pool = new pg.Pool({
        connectionString: process.env.DATABASE_URL,
    });
    pool.connect((connErr, client, done) => {
        client.query('select * from cards where printings is null limit 30;', (err, result) => {
            console.log(result);
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
                            const printings = [];
                            cards.forEach((c) => {
                                if (c.name === splitName) {
                                    card = c;
                                    const copy = {
                                        rarity: card.rarity[0],
                                        set: card.set,
                                    };
                                    if (Object.hasOwnProperty.call(card, 'multiverseid')) {
                                        copy.multiverseid = card.multiverseid;
                                    }
                                    printings.push(copy)
                                }
                            });
                            console.log(card.name);
                            found.push(row);

                            let colors = 'C';
                            if (Object.hasOwnProperty.call(card, 'colors')) {
                                colors = card.colors.reduce((out, c) => {
                                    if (c === 'Blue') {
                                        return `${out}U`;
                                    }
                                    return `${out}${c[0]}`;
                                }, '');
                            }

                            client.query(
                                'update cards set cmc = $1, mana_cost = $2, reserved = $3, color = $5, types = $6, multiverse_id = $7, printings = $8 where card_id = $4',
                                [card.cmc, card.manaCost, card.reserved || false, row.card_id, colors, card.types.join(','), card.multiverseid, JSON.stringify(printings)],
                                (inErr) => {
                                    if (inErr) {
                                        throw new Error(inErr);
                                    }
                                }
                            );
                            // console.log(query);
                        });
                }))
                    .then(() => response.send(found))
                    .catch((err) => response.send(err));
            }
            done();
        });
    });
});

module.exports = router;
