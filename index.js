const express = require('express');
const path = require('path');

const app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(path.resolve(__dirname, './public')));

app.get('/', (request, response) => {
  response.render('public/index.html');
});

app.listen(app.get('port'), () => {
  console.log('Node app is running on port', app.get('port'));
});
