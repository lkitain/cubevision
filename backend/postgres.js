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

const addCardToCube = (cubeId, cardId, client, cb) => {
    const query = `insert into cube_cards (cube_id, card_id) values (${cubeId}, ${cardId})`;
    console.log(query);
    client.query(query, (err) => {
        if (err) {
            console.log(err);
            if (err.code === '23505') {
                // card is already a part of this cube
                cb();
            } else {
                console.log(err);
                throw new Error(err);
            }
        } else {
            cb();
        }
    });
};

const acquireCard = (cardId, client, cb) => {
    const query = 'insert into cube_cards (cube_id, card_id) values ($1, $2)';
    console.log(query);
    client.query(query, [constants.OUR_BINDER, cardId], (err) => {
        if (err) {
            console.log(err);
            if (err.code === '23505') {
                // card is already a part of this cube
                cb();
            } else {
                console.log(err);
                throw new Error(err);
            }
        } else {
            cb();
        }
    });
};

module.exports = {
    acquireCard,
    addCardToCube,
    findOrCreateCard,
};
