const fetch = require('node-fetch');
const parser = require('node-html-parser');
const pg = require('pg');

pg.defaults.ssl = true;

const {
    addCardToCube,
    findOrCreateCard,
} = require('./backend/postgres');

const NEWEST_CUBE = 24;
const CUBE_URL = 'https://magic.wizards.com/en/articles/archive/vintage-cube-cardlist';
// const CUBE_URL = 'https://magic.wizards.com/en/articles/archive/magic-online/vintage-cube-july-2021-update';
// const CUBE_URL = 'https://magic.wizards.com/en/articles/archive/magic-online/spotlight-cube-series-alt-vintage-cube-2021-05-26';

function pool() {
    return new pg.Pool({
        connectionString: process.env.DATABASE_URL || 'postgresql://ianhook@localhost:5432/ianhook',
        ssl: process.env.DATABASE_URL ? true : false,
    });
}

function insertCards(cube, cards) {
    const out = [];
    return pool().connect((connErr, client, done) => {
        return Promise.all(
            cards.map((name) => new Promise((resolve) => {
                findOrCreateCard(name, client, (id) => {
                    out.push(id);
                    resolve();
                });
            })),
        )
            .then(() => Promise.all(
                out.map((cardId) => addCardToCube(cube, cardId, client)),
            ))
            .then(() => {
                console.log(out);
                done();
            });
    });
}

async function main() {
    await new Promise((resolve) => {
        fetch(CUBE_URL)
            .then((res) => res.text())
            .then((body) => parser.parse(body))
            .then((el) => el.querySelector('table.sortable-table tbody'))
            .then((table) => table.querySelectorAll('tr a'))
            .then((rows) => rows.map((row) => row.text))
            .then((cardNames) => console.log(cardNames))
            // .then((cardNames) => insertCards(NEWEST_CUBE, cardNames))
            .then(() => resolve());
    });
}

main();
