const express = require('express');
const expressJwt = require('express-jwt');

const config = require('../config.json');
const controller = require('./users.controller');

const app = express();
const router = express.Router();

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
router.post('/authenticate', controller.authenticate);
router.post('/register', controller.register);
router.get('/', controller.getAll);
router.get('/check', controller.checkExistence);
router.get('/current', controller.getCurrent);
router.put('/:_id', controller.update);
router.delete('/:_id', controller._delete); // eslint-disable-line no-underscore-dangle

module.exports = router;

// error handler
app.use((err, req, res) => {
  if (err.name === 'UnauthorizedError') {
    res.status(401).send('Invalid Token');
  } else {
    throw err;
  }
});
