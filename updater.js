const pg = require('pg');
const { queryPrintings, updateReserved } = require('./backend/utils');

const args = process.argv.slice(2);

const startParam = parseInt(args[0], 10);
const endParam = parseInt(args[1], 10);
const STEP = 5;

async function doUpdate(start, end) {
    let current = start;
    let currentEnd = end;
    const pool = new pg.Pool({
        connectionString: process.env.DATABASE_URL,
    });
    const client = await pool.connect();
    while (current < end) {
        currentEnd = current + STEP - 1;
        console.log(current, currentEnd);
        await updateReserved(client);
        // await queryPrintings(current, currentEnd, client);
        current = currentEnd + 1;
        console.log('~~~~~~~~~~ batch:', currentEnd);
    }
    client.release();
}

if (!Number.isNaN(startParam) && !Number.isNaN(endParam)) {
    doUpdate(startParam, endParam);
}
