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

// User authentication
router.use(requiresUserAuth);
router.get('/auth', controller.authenticate);
router.get('/userinfo', controller.userInfo);

// Admin authentication
router.use(requiresAdminAuth);

module.exports = router;
