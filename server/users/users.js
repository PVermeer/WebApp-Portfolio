const express = require('express');

const controller = require('./users.controller');
const { requiresUserAuth } = require('./auth.service');
const { disableCache } = require('../_services/cache-control');
const { DbConnectionError } = require('../database/connection');

const router = express.Router();

// Middleware
router.use(disableCache);
router.use(DbConnectionError);

// -----------Routes-------------------

// No authentication
router.post('/login', controller.logIn);
router.post('/register', controller.register);
router.get('/check', controller.checkDuplicate);
router.get('/logincheck', controller.loginCheck);
router.get('/verify', controller.verifyEmail);

// User authentication (authenticates then adds "userId" and "usertype" keys to request)
router.use(requiresUserAuth);

// User
router.get('/userinfo', controller.userInfo);
router.put('/update', controller.userUpdate);

// Admin
router.get('/getall', controller.userGetAll);

// Catch all
router.use('*', (req, res) => {
  res.status(400).send('What are you asking for?');
});

module.exports = router;
