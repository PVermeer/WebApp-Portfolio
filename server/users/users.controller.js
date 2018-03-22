
const userService = require('./users.service');

exports.logIn = (req, res) => {
  userService.logIn(req.body, res)
    .then((response) => { res.json(response); })
    .catch((err) => { res.status(400).send(err); });
};

exports.register = (req, res) => {
  userService.register(req.body)
    .then((response) => { res.json(response); })
    .catch((err) => { res.status(400).send(err); });
};

exports.authenticate = (req, res) => {
  res.status(200).send();
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
