const pg = require('pg');
const { moveToHashes, moveFromHashes } = require('./backend/utils');
const constants = require('./ui/consts');

function pool() {
    return new pg.Pool({
        connectionString: process.env.DATABASE_URL || 'postgresql://ianhook@localhost:5432/ianhook',
        ssl: process.env.DATABASE_URL ? true : false,
    });
}

pool().connect((connErr, client, done) => {
    console.log(connErr);
    // moveToHashes(constants.HASH_DIVISOR, client).then(() => done());
    moveFromHashes(client).then(() => done());
});
