const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const httpsRedirect = require('express-https-redirect');

const cubes = require('./backend/cubes');
const cards = require('./backend/cards');

const allowCrossDomain = (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    // intercept OPTIONS method
    if (req.method === 'OPTIONS') {
        res.send(200);
    } else {
        next();
    }
};

const app = express();

app.set('port', (process.env.PORT || 5000));

app.use('/', httpsRedirect());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// setup CORS
app.use(allowCrossDomain);

app.use(express.static(path.resolve(__dirname, './public')));

app.use('/api/cube', cubes);
app.use('/api/card', cards);

app.use((req, res) => {
    res.sendFile(path.resolve(__dirname, './public/index.html'));
});

app.listen(app.get('port'), () => {
    console.log('Node app is running on port', app.get('port'));
});
