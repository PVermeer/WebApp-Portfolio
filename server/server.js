const express = require('express');
const path = require('path');
const compression = require('compression');
const bodyParser = require('body-parser');

require('./database/connection');
const users = require('./users/users');

const app = express();

// Middleware
app.use(compression());
app.use(express.static(path.join(__dirname, '../client/dist')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// -----------------Routes--------------------

app.use('/users', users);

app.use('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

const port = process.env.PORT || 8080;
app.listen(port);
console.log(`Listening to port ${port}`); // eslint-disable-line no-console
