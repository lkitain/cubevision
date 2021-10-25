const { getData } = require('./backend/utils');
const CardDB = require('./backend/card_db');

const args = process.argv.slice(2);

const startParam = parseInt(args[0], 10);
const endParam = parseInt(args[1], 10);
const STEP = 1;

function doUpdate(start, end) {
    let current = start;
    let currentEnd = end;
    const db = new CardDB(process.env.DATABASE_URL);
    // await db.initialize();
    while (current < end) {
        currentEnd = current + STEP - 1;
        db.queryCardRange(current, currentEnd)
            .then((result) => Promise.all(
                result.rows.map((row) => getData(row, {})
                    .then((data) => {
                        console.log(data.card.name);
                        return db.updatePrintings(
                            data.card, data.cardId,
                            data.colors, data.printings,
                        );
                    })),
            )
                .then(() => console.log('success'))
                .catch((dataErr) => {
                    console.log('update error', dataErr);
                }))
            .catch((err) => console.log(`Error ${err}`));
        current = currentEnd + 1;
        console.log('~~~~~~~~~~ batch:', currentEnd);
    }
    // db.release();
}

if (!Number.isNaN(startParam) && !Number.isNaN(endParam)) {
    doUpdate(startParam, endParam);
}
