const pg = require('pg');
const fs = require('fs');
const mtg = require('mtgsdk');
const path = require('path');

const {
    updatePrintings,
    reserveDB,
} = require('./postgres');

pg.defaults.ssl = true;

const isNotOnlineOnly = set => !(/ME[D1-4]|VMA|TPR|PZ1|PMODO/i.test(set.set));

function getData(row) {
    const splitName = row.name.split(' // ');
    console.log(splitName);
    return Promise.all(splitName.map(cName => new Promise((resolve, reject) => {
        const data = {
            printings: [],
        };
        const ev = mtg.card
            .all({ name: cName });
        ev.on('data', (card) => {
            // console.log('data');
            console.log(card);
            // console.log(cName);
            // console.log(row.name);
            const { printings } = data;
            if (card.name === cName) {
                // console.log('data: ', cName);
                // console.log(card.set);
                const copy = {
                    rarity: card.rarity[0],
                    set: card.set,
                };
                if (Object.hasOwnProperty.call(card, 'multiverseid')) {
                    copy.multiverseid = card.multiverseid;
                }
                printings.push(copy);
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
            data.printings = printings.filter(set => isNotOnlineOnly(set) && set.multiverseid);
            data.cardId = row.card_id;
        });
        ev.on('end', () => resolve(data));
        ev.on('err', (err) => {
            console.log('err', err);
            reject(err);
        });
    })))
        .then((data) => {
            const outData = data[0];
            // console.log('getData data:', data);
            data.forEach((curr, i) => {
                const colors = outData.colors.split();
                curr.colors.split().forEach((c) => {
                    if (colors.indexOf(c) === -1) {
                        colors.push(c);
                    }
                });
                if (i > 0) {
                    outData.card.manaCost = `${outData.card.manaCost} // ${curr.card.manaCost}`;
                }
                outData.colors = colors.sort((a, b) => {
                    if (a === 'W') { return -1; }
                    if (b === 'W') { return 1; }
                    if (a === 'U') { return -1; }
                    if (b === 'U') { return 1; }
                    if (a === 'B') { return -1; }
                    if (b === 'B') { return 1; }
                    if (a === 'R') { return -1; }
                    if (b === 'R') { return 1; }
                    if (a === 'G') { return -1; }
                    if (b === 'G') { return 1; }
                    return 0;
                }).join('');
            });
            return outData;
        });
}

const reserveList = [];

function isReserved(cardName) {
    if (reserveList.length === 0) {
        const list = fs.readFileSync(path.resolve('./reserve_list.txt'), { encoding: 'utf8', flag: 'r' });
        list.split('\n').forEach((card) => {
            // console.log('card', card)
            reserveList.push(card);
        });
        // console.log(reserveList);
    }
    return reserveList.indexOf(cardName) !== -1;
}

function updateReserved(client) {
    return client.query('select * from cards;')
        .then(result => Promise.all(
            result.rows.map(row => reserveDB(client, row, isReserved(row.name))),
        ));
}

function queryPrintings(start, end, client) {
    return client.query(`select * from cards where card_id between ${start} and ${end};`)
        .then(result => Promise.all(
            result.rows.map(row => getData(row, {})
                .then((data) => {
                    // console.log(data.card);
                    updatePrintings(
                        data.card, data.cardId,
                        data.colors, data.printings, client, isReserved(data.card.name),
                    );
                    return data.card;
                })),
        )
            .then(() => console.log('success'))
            .catch((dataErr) => {
                console.log('update error', dataErr);
            }))
        .catch(err => console.log(`Error ${err}`));
}

module.exports = {
    queryPrintings,
    getData,
    updateReserved,
};
