const express = require('express');
const path = require('path');
const compression = require('compression');
const bodyParser = require('body-parser');

require('./database/connection');
const mail = require('./mail/mail');
const users = require('./users/users');
const { sendErrorMail } = require('./mail/error');

const app = express();

// Middleware
app.use(compression());
app.use(express.static(path.join(__dirname, '../client/dist')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// -----------------Routes--------------------

app.use('/mail', mail);
app.use('/users', users);

app.get('*', (req, res, next) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'), (error) => {
    if (error) next(error);
  });
});

app.use((error, req, res, next) => {
  res.status(500).send('Something broke!');
  sendErrorMail(error);
  next();
});

// Start server
const port = process.env.PORT || 8080;
app.listen(port);
console.log(`Listening to port ${port}`); // eslint-disable-line no-console
