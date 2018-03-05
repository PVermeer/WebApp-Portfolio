// Modules
const express = require('express');
const path = require('path');
const compression = require('compression');
const bodyParser = require('body-parser');

const mail = require('./mail/mail');

const app = express();

// Middleware
app.use(compression());
app.use(express.static('./client/dist'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// -----------------Routes--------------------

app.use('/mail', mail);

app.use('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});


// Start server
const port = process.env.PORT || 8080;
app.listen(port);
console.log(`Listening to port ${port}`); // eslint-disable-line no-console
