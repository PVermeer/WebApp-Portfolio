const express = require('express');

const controller = require('./mail.controller');

const router = express.Router();

// -----------Routes-------------------

router.post('/contact-form', controller.contactForm);


module.exports = router;
