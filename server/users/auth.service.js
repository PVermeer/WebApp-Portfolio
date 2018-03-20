const jwt = require('jsonwebtoken');
const { compare, hash } = require('bcryptjs');

const { User } = require('../database/models/user');
const { secret, secret2 } = require('../config.json');


// -------------User functions--------------

// Find user
exports.findUserByEmail = (email, fetch) => new Promise((resolve, reject) => {
  User.findOne({ email }, fetch, (error, result) => {
    if (error) reject(error);
    resolve(result);
  });
});

exports.findUserByUsername = (usernameIndex, fetch) => new Promise((resolve, reject) => {
  User.findOne({ usernameIndex }, fetch, (error, result) => {
    if (error) reject(error);
    resolve(result);
  });
});

exports.findUserById = (_id, fetch) => new Promise((resolve, reject) => {
  User.findOne({ _id }, fetch, (error, result) => {
    if (error) reject(error);
    resolve(result);
  });
});

// Save user
exports.saveUser = userForm => new Promise((resolve, reject) => {
  User(userForm).save((error, result) => {
    if (error) reject(error);
    resolve(result);
  });
});

// Password
exports.hashPassword = password => new Promise((resolve, reject) => {
  hash(password, 10, (error, result) => {
    if (error) reject(error);
    resolve(result);
  });
});

exports.comparePasswords = (password, hashPassword) => new Promise((resolve, reject) => {
  compare(password, hashPassword, (error, res) => {
    if (error) reject(error);
    resolve(res);
  });
});

// ----------------------Tokens--------------------
exports.createTokens = (id, type, hashPassword) => new Promise((resolve) => {
  const token = jwt.sign({ user: id, type }, secret, { expiresIn: '10m' });
  const refreshToken = jwt.sign({ user: id, type }, secret2 + hashPassword, { expiresIn: '30m' });

  Promise.all([token, refreshToken]).then(() => {
    const tokens = { token, refreshToken };
    resolve(tokens);
  });
});

exports.verifyToken = token => new Promise((resolve) => {
  jwt.verify(token, secret, (error, decoded) => {
    if (error) resolve(false);
    resolve(decoded);
  });
});

exports.verifyRefreshToken = (refreshToken, user) => new Promise((resolve) => {
  jwt.verify(refreshToken, secret2 + user.hash, (error) => {
    if (error) resolve(false);
    resolve(true);
  });
});

exports.decodeToken = async (refreshToken) => {
  const decoded = await jwt.decode(refreshToken);
  return decoded;
};

exports.refreshTokens = async (refreshToken) => {
  const decoded = await exports.decodeToken(refreshToken);

  const user = await exports.findUserById(decoded.user, { typ: 1, hash: 1 });
  if (!user) return false;

  const verifiedRefreshToken = await exports.verifyRefreshToken(refreshToken, user);
  if (!verifiedRefreshToken) return false;

  const newTokens = await exports.createTokens(user._id, user.type, user.hash);
  if (!newTokens.token || !newTokens.refreshToken) return false;

  return newTokens;
};

// ------------Authentication middleware----------------

// User authentication
exports.requiresUserAuth = async (req, res, next) => {
  const authError = 'You\'re not logged in!';

  const token = req.headers['x-token'];
  if (!token) return res.status(401).send(authError);

  const verifiedToken = await exports.verifyToken(token);
  if (verifiedToken) { req.userId = verifiedToken.user; return next(); }

  const refreshToken = req.headers['x-refresh-token'];
  if (!refreshToken) return res.status(401).send(authError);

  const newTokens = await exports.refreshTokens(refreshToken);
  if (!newTokens) return res.status(401).send(authError);

  res.set('x-token', newTokens.token);
  res.set('x-refresh-token', newTokens.refreshToken);

  return next();
};

// Admin authentication
exports.requiresAdminAuth = async (req, res, next) => {
  const token = req.headers['x-token'];
  if (!token) return res.status(401).send();

  const verifiedToken = await exports.verifyToken(token);
  if (verifiedToken.type === 'admin') return next();

  const refreshToken = req.headers['x-refresh-token'];
  if (!refreshToken) return res.status(401).send();

  const newTokens = await exports.refreshTokens(refreshToken);
  if (!newTokens) return res.status(401).send();

  res.set('x-token', newTokens.token);
  res.set('x-refresh-token', newTokens.refreshToken);

  return next();
};
