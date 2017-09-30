const express = require('express');
const pg = require('pg');
const mtg = require('mtgsdk');

const {
    acquireCard,
    addCardToCube,
    checkCardInCube,
    removeCardFromCube,
    updatePrintings,
    setVersion,
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

router.post('/setversion', (request, response) => {
    console.log('setversion')
    const pool = new pg.Pool({
        connectionString: process.env.DATABASE_URL,
    });
    const cardId = request.body.cardId;
    const multiverseid = request.body.multiverseid;
    console.log(request.body);
    pool.connect((connErr, client, done) => {
        setVersion(cardId, multiverseid, client)
            .then(() => {
                response.send(true);
                done();
            })
            .catch((err) => {
                response.send(err);
                done();
            });
    });
});

// router.post('/acquire', (request, response) => {
//     const pool = new pg.Pool({
//         connectionString: process.env.DATABASE_URL,
//     });
//     const cardId = request.body.cardId;
//     pool.connect((connErr, client, done) => {
//         acquireCard(cardId, client, () => {
//             response.send(true);
//             done();
//         });
//     });
// });
//
//
// router.post('/replace', (request, response) => {
//     const pool = new pg.Pool({
//         connectionString: process.env.DATABASE_URL,
//     });
//     const newCardId = request.body.newCardId;
//     const oldCardId = request.body.oldCardId;
//     pool.connect((connErr, client, done) => {
//         Promise.all([
//             checkCardInCube(newCardId, constants.OUR_BINDER),
//             checkCardInCube(oldCardId, constants.OUR_CUBE),
//         ])
//             .then(() => startTransaction(client))
//             .then(Promise.all([
//                 addCardToCube(constants.OUR_CUBE, newCardId, client),
//                 addCardToCube(constants.OUR_BINDER, oldCardId, client),
//                 removeCardFromCube(constants.OUR_BINDER, newCardId, client),
//                 removeCardFromCube(constants.OUR_CUBE, oldCardId, client),
//             ]))
//             .then(() => commitTransaction(client))
//             .catch((err) => {
//                 console.log(err);
//                 return rollbackTransaction(client);
//             })
//             .then((json) => {
//                 response.send(json);
//                 done();
//             });
//     });
// });
//
router.get('/update', (request, response) => {
    console.log('asdf');
    const pool = new pg.Pool({
        connectionString: process.env.DATABASE_URL,
    });
    pool.connect((connErr, client, done) => {
        client.query('select * from cards where printings is null limit 30;', (err, result) => {
            // console.log(result);
            if (err) {
                response.send(`Error ${err}`);
            } else {
                const found = [];
                Promise.all(
                    result.rows.map(row =>
                        getData(row, {})
                            .then(data => {
                                console.log('sql', data);
                                updatePrintings(data.card, data.cardId, data.colors, data.printings, client);
                            })
                            .catch(err => response.send(err))
                        )
                )
                    .then(() => response.send(success))
                    .catch(err => response.send(err));
            }
            done();
        });
    });
});

function getData(row) {
    const splitName = row.name.split(' // ');
    return Promise.all(splitName.map(cName =>
        new Promise((resolve) => {
            console.log(cName);
            const data = {
                printings: [],
            };
            let totalPrints = 1000000;
            const ev = mtg.card
                .all({ name: cName });
            ev.on('data', (card) => {
                    // console.log('data');
                    // // console.log(card);
                    // console.log(cName);
                    // console.log(row.name);
                    const printings = data.printings;
                    if (card.name === cName) {
                        // console.log(card.set);
                        const copy = {
                            rarity: card.rarity[0],
                            set: card.set,
                        };
                        if (Object.hasOwnProperty.call(card, 'multiverseid')) {
                            copy.multiverseid = card.multiverseid;
                        }
                        printings.push(copy);
                        totalPrints = card.printings.length;
                        // console.log(totalPrints);
                    } else {
                        return;
                    }

                    let colors = 'C';
                    if (Object.hasOwnProperty.call(card, 'colors')) {
                        colors = card.colors.reduce((out, c) => {
                            if (c === 'Blue') {
                                return `${out}U`;
                            }
                            return `${out}${c[0]}`;
                        }, '');
                    }
                    data.card = card;
                    data.colors = colors;
                    data.printings = printings;
                    data.cardId = row.card_id;
                });
            ev.on('end', () => resolve(data));
            ev.on('err', (err) => { console.log('err', err); });
        })))
        .then((data) => {
            const outData = data[0];
            data.forEach((curr, i) => {
                const colors = outData.colors.split();
                curr.colors.split().forEach((c) => {
                    if (colors.indexOf(c) === -1) {
                        colors.push(c);
                    }
                });
                if (i > 0) {
                    outData.card.manaCost = `${outData.card.manaCost} // ${curr.card.manaCost}`
                }
                outData.colors = colors.sort((a, b) => {
                    if (a === 'W') {
                        return -1;
                    } else if (b === 'W') {
                        return 1;
                    } else if (a === 'U') {
                        return -1;
                    } else if (b === 'U') {
                        return 1;
                    } else if (a === 'B') {
                        return -1;
                    } else if (b === 'B') {
                        return 1;
                    } else if (a === 'R') {
                        return -1;
                    } else if (b === 'R') {
                        return 1;
                    } else if (a === 'G') {
                        return -1;
                    } else if (b === 'G') {
                        return 1;
                    }
                    return 0;
                }).join('');
            });
            return outData;
        });
}

module.exports = router;
