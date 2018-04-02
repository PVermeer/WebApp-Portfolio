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
router.get('/verify', controller.verifyEmail);

// User authentication (authenticates then adds "userId" and "userType" keys to request)
router.get('/logincheck', requiresUserAuth(200), controller.loginCheck);

router.use(requiresUserAuth(401)); // 401 response from now on

// User
router.get('/info', controller.userInfo);
router.put('/update', controller.userUpdate);
router.delete('/delete/:id', controller.userDelete);
router.post('/many', controller.userMany);
router.delete('/deletemany/:id', controller.userDeleteMany);

// Admin
router.get('/getall', controller.userGetAll);
router.post('/registermock', controller.mockUser);

// Catch all
router.use('*', (req, res) => {
  res.status(400).send('What are you asking for?');
});

module.exports = router;
