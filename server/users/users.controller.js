// const express = require('express');

// const router = express.Router();
const userService = require('./users.service');

exports.authenticate = (req, res) => {
  userService.authenticate(req.body.username, req.body.password)
    .then((user) => {
      if (user) {
        // authentication successful
        res.send(user);
      } else {
        // authentication failed
        res.status(400).send('Username or password is incorrect');
      }
    })
    .catch((err) => { res.status(400).send(err); });
};

exports.register = (req, res) => {
  userService.create(req.body)
    .then(() => {
      res.json('success');
    })
    .catch((err) => {
      res.status(400).send(err);
    });
};

exports.getAll = (req, res) => {
  userService.getAll()
    .then((users) => { res.send(users); })
    .catch((err) => { res.status(400).send(err); });
};

exports.getUsername = (req, res) => {
  userService.getByUsername(req.params.userName)
    .then((user) => { res.json(user); })
    .catch((err) => { res.status(400).send(err); });
};

exports.getCurrent = (req, res) => {
  userService.getById(req.user.sub)
    .then((user) => {
      if (user) { res.send(user); } else { res.sendStatus(404); }
    })
    .catch((err) => { res.status(400).send(err); });
};

exports.update = (req, res) => {
  userService.update(req.params._id, req.body)
    .then(() => { res.json('success'); })
    .catch((err) => { res.status(400).send(err); });
};

// Remove later after testing
/* eslint-disable no-underscore-dangle */
exports._delete = (req, res) => {
  userService.delete(req.params._id)
    .then(() => { res.json('success'); })
    .catch((err) => { res.status(400).send(err); });
};
/* eslint-enable no-underscore-dangle */
