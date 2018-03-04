// Modules
const express = require('express');
const path = require('path');
const compression = require('compression');

const users = require('./users/users');

const app = express();

// Local modules

// Middleware
app.use(compression());
app.use(express.static(path.join(__dirname, '../client/dist')));

// -----------------Routes--------------------

app.use('/users', users);

app.use('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

const port = process.env.PORT || 8080;
app.listen(port);
console.log(`Listening to port ${port}`); // eslint-disable-line no-console
