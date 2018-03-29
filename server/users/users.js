const express = require('express');

const controller = require('./users.controller');
const { requiresUserAuth, requiresAdminAuth } = require('./auth.service');
const { DbConnectionError } = require('../database/connection');

const router = express.Router();

// Middleware
router.use(DbConnectionError);

// -----------Routes-------------------

// No authentication
router.post('/login', controller.logIn);
router.post('/register', controller.register);
router.get('/check', controller.checkDuplicate);
router.get('/logincheck', controller.loginCheck);
router.get('/verify', controller.verifyEmail);

// User authentication (authenticates then adds "userId" key to request)
router.get('/userinfo', requiresUserAuth, controller.userInfo);
router.put('/update', requiresUserAuth, controller.userUpdate);

// Admin authentication
router.get('/admin', requiresAdminAuth, (req, res) => { res.send('something'); }); // Temp

router.use('*', (req, res) => {
  res.status(400).send('What are you asking for?');
});

module.exports = router;
