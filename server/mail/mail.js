const express = require('express');

const contact = require('./contact');

const router = express.Router();

// Routes from /mail
router.post('/contact-form', (req, res) => {
  contact.contactForm(req)
    .then((response) => { res.json(response); });
});

module.exports = router;
