const jwt = require('jsonwebtoken');
const { compare, hash } = require('bcryptjs');

const { User, UserTemp } = require('../database/models/user');
const {
  secret, secret2, tokenExpires, refreshTokenExpires,
  verificationTokenExpires,
} = require('../config.json');


// -------------User functions--------------

// Find user
exports.findUserByEmail = (email, fetch) => new Promise((resolve, reject) => {
  User.findOne({ email }, fetch, { lean: true }, (error, result) => {
    if (error) return reject(error);
    if (result) return resolve(result);

    return UserTemp.findOne({ email }, fetch, { lean: true }, (error2, result2) => {
      if (error2) return reject(error2);
      return resolve(result2);
    });
  });
});

exports.findUserByUsername = (username, fetch) => new Promise((resolve, reject) => {
  const usernameIndex = username.toLowerCase().trim();
  User.findOne({ usernameIndex }, fetch, { lean: true }, (error, result) => {
    if (error) return reject(error);
    if (result) return resolve(result);

    return UserTemp.findOne({ usernameIndex }, { lean: true }, fetch, (error2, result2) => {
      if (error2) return reject(error2);
      return resolve(result2);
    });
  });
});

exports.findUserById = (_id, fetch) => new Promise((resolve, reject) => {
  User.findOne({ _id }, fetch, { lean: true }, (error, result) => {
    if (error) reject(error);
    resolve(result);
  });
});

exports.findAllUsers = () => new Promise((resolve, reject) => {
  User.find({}, { hash: 0, usernameIndex: 0 }, { lean: true }, (error, result) => {
    if (error) reject(error);
    resolve(result);
  });
});

// Save temp user
exports.saveTempUser = userForm => new Promise(async (resolve, reject) => {
  const user = userForm;
  user.verificationToken = await exports.createVerificationToken(userForm.email);

  UserTemp(userForm).save((error, result) => {
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

// Update user
exports.updateUser = (updateForm, id) => new Promise((resolve, reject) => {
  User.update({ _id: id }, { $set: updateForm }, { runValidators: true }, (error, result) => {
    if (error) reject(error);
    resolve(result);
  });
});

// Delete temp user
exports.deleteTempUserByEmail = email => new Promise((resolve, reject) => {
  UserTemp.deleteOne({ email }, (error, result) => {
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

// Tokens
exports.createVerificationToken = email => new Promise((resolve) => {
  const token = jwt.sign({ user: email }, secret, { expiresIn: verificationTokenExpires });
  resolve(token);
});

exports.createTokens = (id, username, type, hashPassword) => new Promise((resolve) => {
  const token = jwt.sign({ user: id, username, type }, secret, { expiresIn: tokenExpires });
  const refreshToken = jwt.sign(
    { user: id, username, type },
    secret2 + hashPassword, { expiresIn: refreshTokenExpires },
  );

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

exports.decodeToken = async (token) => {
  const decoded = await jwt.decode(token);
  return decoded;
};

exports.refreshTokens = async (refreshToken) => {
  const decoded = await exports.decodeToken(refreshToken);

  const user = await exports.findUserById(decoded.user, { typ: 1, username: 1, hash: 1 });
  if (!user) return false;

  const verifiedRefreshToken = await exports.verifyRefreshToken(refreshToken, user);
  if (!verifiedRefreshToken) return false;

  const newTokens = await exports.createTokens(user._id, user.username, user.type, user.hash);
  if (!newTokens.token || !newTokens.refreshToken) return false;

  newTokens.userId = user.id;
  return newTokens;
};

// ------------Authentication middleware----------------

// User authentication
exports.requiresUserAuth = async (req, res, next) => {
  const authError = 'You\'re not logged in!';

  const token = req.headers['x-token'];
  if (!token) return res.status(401).send(authError);

  const verifiedToken = await exports.verifyToken(token);
  if (verifiedToken) {
    req.userId = verifiedToken.user;
    req.userType = verifiedToken.type;
    return next();
  }

  const refreshToken = req.headers['x-refresh-token'];
  if (!refreshToken) return res.status(401).send(authError);

  const newTokens = await exports.refreshTokens(refreshToken);
  if (!newTokens) return res.status(401).send(authError);

  req.UserId = newTokens.userId;
  res.set('x-token', newTokens.token);
  res.set('x-refresh-token', newTokens.refreshToken);

  return next();
};
