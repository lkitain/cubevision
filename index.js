const express = require('express');
const path = require('path');
const cubes = require('./backend/cubes');

const app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(path.resolve(__dirname, './public')));

app.use('/api/cube', cubes);

app.use((req, res) => {
    res.sendFile(path.resolve(__dirname, './public/index.html'));
});

app.listen(app.get('port'), () => {
    console.log('Node app is running on port', app.get('port'));
});
