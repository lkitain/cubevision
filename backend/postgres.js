const constants = require('../ui/consts');

const findOrCreateCard = (name, client, cb) => {
    const query = 'select card_id from cards where name = $1';
    client.query(query, [name], (err, result) => {
        console.log(name);
        if (err) {
            console.log(err);
            throw new Error(err);
        } else if (result.rows.length === 1) {
            cb(result.rows[0].card_id);
        } else {
            client.query('insert into cards (name) values ($1)', [name], (inErr) => {
                if (inErr) {
                    throw new Error(inErr);
                } else {
                    client.query(query, [name], (err2, result2) => {
                        if (err2) {
                            throw new Error(err2);
                        } else {
                            cb(result2.rows[0].card_id);
                        }
                    });
                }
            });
        }
    });
};

const addCardToCube = (cubeId, cardId, client) => new Promise((resolve, reject) => {
    // const query = 'insert into cube_cards (cube_id, card_id) values ($1, $2)';
    const cardInt = parseInt(cardId, 10);
    const hash = cardInt % constants.HASH_DIVISOR;
    const select = 'select * from cube_card_hash where cube_id = $1 and hash_divisor = $2 and hash_id = $3';
    const update = 'update cube_card_hash set card_ids = array_append(card_ids, $4) where cube_id = $1 and hash_divisor = $2 and hash_id = $3';
    const insert = 'insert into cube_card_hash (cube_id, card_ids, hash_id, hash_divisor) values ($1, $2, $3, $4)';
    client.query(select, [cubeId, constants.HASH_DIVISOR, hash], (err, result) => {
        // TODO: row does not exist
        if (err) {
            console.log(err);
            reject(err);
        } else if (result.rows.length === 0) {
            console.log('insert');
            client.query(insert, [cubeId, [cardId], hash, constants.HASH_DIVISOR]).then((insertErr) => {
                if (insertErr) {
                    console.log(insertErr);
                    reject(insertErr);
                } else {
                    console.log('added');
                    resolve();
                }
            });
        } else {
            console.log('update');
            if (result.rows[0].card_ids.includes(cardInt)) {
                console.log('skipping');
                resolve();
            } else {
                client.query(update, [cubeId, constants.HASH_DIVISOR, hash, cardId], (updateErr) => {
                    if (updateErr) {
                        console.log(updateErr);
                        if (updateErr.code === '23505') {
                            // card is already a part of this cube
                            resolve();
                        } else {
                            console.log(updateErr);
                            reject(updateErr);
                        }
                    } else {
                        console.log('added');
                        resolve();
                    }
                });
            }
        }
    });
});

const removeCardFromCube = (cubeId, cardId, client) => new Promise((resolve, reject) => {
    const select = 'select * from cube_card_hash where cube_id = $1 and hash_divisor = $2 and hash_id = $3';
    const update = 'update cube_card_hash set card_ids = $4 where cube_id = $1 and hash_divisor = $2 and hash_id = $3';
    const cardInt = parseInt(cardId, 10);
    const hash = cardInt % constants.HASH_DIVISOR;
    client.query(select, [cubeId, constants.HASH_DIVISOR, hash], (err, result) => {
        // TODO: row does not exist
        if (err) {
            console.log(err);
            reject(err);
        } else if (result.rows.length === 0) {
            console.log('not found');
            reject();
        } else {
            console.log('update');
            console.log(result.rows[0]);
            const newCards = result.rows[0].card_ids.filter((v) => v !== cardInt);
            console.log(newCards);
            client.query(update, [cubeId, constants.HASH_DIVISOR, hash, newCards], (updateErr) => {
                if (updateErr) {
                    console.log(updateErr);
                    if (updateErr.code === '23505') {
                        // card is already a part of this cube
                        resolve();
                    } else {
                        console.log(updateErr);
                        reject(updateErr);
                    }
                } else {
                    console.log('removed');
                    resolve();
                }
            });
        }
    });
});

const acquireCard = (cardId, client) => addCardToCube(constants.OUR_BINDER, cardId, client);

const setVersion = (cardId, multiverseid, client) => new Promise((resolve, reject) => {
    const query = 'update cards set owned_multiverseid = $2 where card_id = $1';
    client.query(query, [cardId, multiverseid], (err) => {
        console.log(err);
        if (err) {
            reject(err);
        } else {
            resolve();
        }
    });
});

const checkCardInCube = (cardId, cubeId, client) => new Promise((resolve, reject) => {
    const query = 'select card_id from cube_cards where card_id = $1 and cube_id = $2';
    client.query(query, [cardId, cubeId], (err) => {
        if (err) {
            reject(err);
        } else {
            resolve();
        }
    });
});

const updatePrintings = (card, cardId, colors, printings, client, reserved) => {
    const params = [
        card.cmc,
        card.manaCost,
        reserved || false,
        cardId,
        colors,
        card.types.join(','),
        card.multiverseid,
        JSON.stringify(printings),
    ];
    // console.log(card.name, params);
    return new Promise((resolve, reject) => client.query(
        'update cards set cmc = $1, mana_cost = $2, reserved = $3, color = $5, types = $6, multiverse_id = $7, printings = $8 where card_id = $4',
        params,
        (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        },
    ));
};

const reserveDB = (client, row, reserved) => {
    if (!reserved) {
        return null;
    }
    const params = [
        row.card_id,
        reserved,
    ];
    console.log('updating', row, reserved);
    return new Promise((resolve, reject) => client.query(
        'update cards set reserved = $2 where card_id = $1',
        params,
        (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        },
    ));
};

const startTransaction = (client) => new Promise((resolve, reject) => {
    client.query('BEGIN', (err) => {
        if (err) {
            reject(err);
        } else {
            resolve();
        }
    });
});

const rollbackTransaction = (client) => new Promise((resolve, reject) => {
    client.query('ROLLBACK', (err) => {
        if (err) {
            reject(err);
        } else {
            resolve('rolled back');
        }
    });
});

const commitTransaction = (client) => new Promise((resolve, reject) => {
    client.query('COMMIT', (err) => {
        if (err) {
            reject(err);
        } else {
            resolve('commited');
        }
    });
});

module.exports = {
    acquireCard,
    addCardToCube,
    checkCardInCube,
    findOrCreateCard,
    removeCardFromCube,
    setVersion,
    updatePrintings,
    reserveDB,

    startTransaction,
    commitTransaction,
    rollbackTransaction,
};
