const express = require('express');
const path = require('path');
const pg = require('pg');
pg.defaults.ssl = true;

const app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(path.resolve(__dirname, './public')));

app.get('/', (request, response) => {
    response.render('public/index.html');
});

app.get('/cube/:cubeId', (request, response) => {
    const cubeId = request.params.cubeId;
    pg.connect(process.env.DATABASE_URL, (err, client, done) => {
        console.log(err);
        client.query(`select * from cube_cards join cubes using(cube_id) join cards using (card_id) where cube_id = ${cubeId};`, (err, result) => {
            done();
            if (err) {
                console.error(err);
                response.send(`Error ${err}`);
            } else {
                response.send(result.rows);
            }
        });
    });
});

app.listen(app.get('port'), () => {
    console.log('Node app is running on port', app.get('port'));
});
