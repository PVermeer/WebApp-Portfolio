const express = require('express');

const controller = require('./users.controller');
const { requiresUserAuth } = require('./auth.service');
const { disableCache } = require('../_services/cache-control');
const { DbConnectionError } = require('../database/connection');
const { userTypes } = require('../database/models/user');

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
router.post('/recoverpassword', controller.passwordRecovery);
router.put('/updatepassword', controller.updatePassword);

// User authentication (authenticates then adds "userId" and "userType" keys to request)
router.get('/logincheck', requiresUserAuth(200, userTypes.user.rank), controller.loginCheck);

// User
router.get('/info', requiresUserAuth(401, userTypes.user.rank), controller.userInfo);
router.put('/update', requiresUserAuth(401, userTypes.user.rank), controller.userUpdate);
router.delete('/delete/:id', requiresUserAuth(401, userTypes.user.rank), controller.userDelete); // Still used?

// Admin
router.get('/getall', requiresUserAuth(401, userTypes.admin.rank), controller.userGetAll);
router.post('/many', requiresUserAuth(401, userTypes.admin.rank), controller.userMany);
router.delete('/deletemany/:id', requiresUserAuth(401, userTypes.admin.rank), controller.userDeleteMany);
router.post('/resetpasswordmany/:id', requiresUserAuth(401, userTypes.admin.rank), controller.userResetPasswordMany);
router.post('/registermock', requiresUserAuth(401, userTypes.admin.rank), controller.mockUser);

// Catch all
router.use('*', (req, res) => {
  res.status(400).send('What are you asking for?');
});

module.exports = router;
