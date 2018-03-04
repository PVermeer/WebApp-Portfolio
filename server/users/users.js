const express = require('express');

const app = express();
const router = express.Router();
const cors = require('cors');
const bodyParser = require('body-parser');
const expressJwt = require('express-jwt');
const config = require('../config.json');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// use JWT auth to secure the api,
// the token can be passed in the authorization header or querystring
app.use(expressJwt({
  secret: config.secret,
  getToken(req) {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
      return req.headers.authorization.split(' ')[1];
    } else if (req.query && req.query.token) {
      return req.query.token;
    }
    return null;
  },
}).unless({ path: ['/users/authenticate', '/users/register'] }));

// routes
router.use('/users', require('./users.controller'));

module.exports = router;

// error handler
app.use((err, req, res) => {
  if (err.name === 'UnauthorizedError') {
    res.status(401).send('Invalid Token');
  } else {
    throw err;
  }
});
