const mailService = require('./mail.service');

exports.contactForm = (req, res) => {
  mailService.contactForm(req, res)
    .then((response) => { res.json(response); })
    .catch((error) => { res.status(400).send(error); });
};

exports.userVerification = (req, res) => {
  mailService.userVerification(req, res)
    .then((response) => { res.json(response); })
    .catch((error) => { res.status(400).send(error); });
};
