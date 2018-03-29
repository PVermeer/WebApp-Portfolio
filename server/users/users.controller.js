
const userService = require('./users.service');

exports.logIn = (req, res) => {
  userService.logIn(req.body, res)
    .then((response) => { res.json(response); })
    .catch((err) => { res.status(400).send(err); });
};

exports.register = (req, res) => {
  userService.register(req)
    .then((response) => { res.json(response); })
    .catch((err) => { res.status(400).send(err); });
};

exports.verifyEmail = (req, res) => {
  userService.verifyEmail(req)
    .then(() => { res.redirect('/user'); })
    .catch((err) => { res.status(400).send(err); });
};

exports.loginCheck = (req, res) => {
  userService.loginCheck(req, res)
    .then((response) => { res.json(response); })
    .catch((err) => { res.status(400).send(err); });
};

exports.checkDuplicate = (req, res) => {
  userService.checkDuplicate(req.query)
    .then((user) => { res.json(user); })
    .catch((err) => { res.status(400).send(err); });
};

exports.userInfo = (req, res) => {
  userService.userInfo(req)
    .then((response) => { res.json(response); })
    .catch((err) => { res.status(400).send(err); });
};

exports.userUpdate = (req, res) => {
  userService.userUpdate(req)
    .then((response) => { res.json(response); })
    .catch((err) => { res.status(400).send(err); });
};

exports.userGetAll = (req, res) => {
  userService.userGetAll(req)
    .then((response) => { res.json(response); })
    .catch((err) => { res.status(400).send(err); });
};
