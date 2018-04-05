const mailService = require('./mail.service');

exports.contactForm = (req, res) => {
  mailService.contactForm(req, res)
    .then((response) => { res.json(response); })
    .catch((error) => { res.status(503).send(error); });
};
