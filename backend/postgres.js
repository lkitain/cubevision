const constants = require('../ui/consts');

const findOrCreateCard = (name, client, cb) => {
    const query = 'select card_id from cards where name =$1';
    console.log(name);
    client.query(query, [name], (err, result) => {
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

const addCardToCube = (cubeId, cardId, client) =>
    new Promise((resolve, reject) => {
        const query = 'insert into cube_cards (cube_id, card_id) values ($1, $2)';
        client.query(query, [cubeId, cardId], (err) => {
            if (err) {
                console.log(err);
                if (err.code === '23505') {
                    // card is already a part of this cube
                    resolve();
                } else {
                    console.log(err);
                    reject(err);
                }
            } else {
                resolve();
            }
        });
    });

const removeCardFromCube = (cubeId, cardId, client) =>
    new Promise((resolve, reject) => {
        const query = 'delete from cube_cards where cube_id = $1 and card_id = $2';
        client.query(query, [cubeId, cardId], (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });

const acquireCard = (cardId, client, cb) => {
    return addCardToCube(constants.OUR_BINDER, cardId, client, cb);
};

const checkCardInCube = (cardId, cubeId, client) =>
    new Promise((resolve, reject) => {
        const query = 'select card_id from cube_cards where card_id = $1 and cube_id = $2';
        client.query(query, [cardId, cubeId], (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });

const startTransaction = client =>
    new Promise((resolve, reject) => {
        client.query('BEGIN', (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });

const rollbackTransaction = client =>
    new Promise((resolve, reject) => {
        client.query('ROLLBACK', (err) => {
            if (err) {
                reject(err);
            } else {
                resolve('rolled back');
            }
        });
    });

const commitTransaction = client =>
    new Promise((resolve, reject) => {
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

    startTransaction,
    commitTransaction,
    rollbackTransaction,
};
