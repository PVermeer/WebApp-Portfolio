const jwt = require('jsonwebtoken');
const { compare, hash } = require('bcryptjs');

const { userTypes, User, UserTemp } = require('../database/models/user');
const { Many } = require('../database/models/many');
const {
  secret, secret2, loginTokenExpires, refreshTokenExpires,
  verificationTokenExpires,
} = require('../config.json');


// -------------User functions--------------

// Find user(s)

/** Find a single user. Mongoose lean (Js object).
 * @param {{any: any}} query Object search key + value.
 * @param {{any: 0|1}} [fetch]
 *  (optional) Object with the return object keys. (1 = do return, 0 = do not return)
 * @returns {Promise<{any}>} User object set by fetch values.
 * */
exports.findUser = (query, fetch) => new Promise((resolve, reject) => {
  if (Object.keys(query).length === 0) { resolve(null); return; }

  User.findOne(query, fetch, { lean: true }, (error, result) => {
    if (error) return reject(error);

    if (result) {
      const user = result;
      if (user._id) user.id = result._id.toString();
      return resolve(user);
    }

    return UserTemp.findOne(query, fetch, { lean: true }, (error2, result2) => {
      if (error2) return reject(error2);

      if (result2) {
        const user2 = result2;
        if (user2._id) user2.id = result2._id.toString();
        return resolve(user2);
      }

      return resolve(result2);
    });
  });
});

/** Find all users. Mongoose lean (Js object).
 * @param {{any: 0|1}} [fetch]
 *  (optional) Object with the return object keys. (1 = do return, 0 = do not return)
 * @returns {Promise<[{any}]>} Array of user object set by fetch values.
 * */
exports.findAllUsers = fetch => new Promise((resolve, reject) => {
  User.find({}, fetch, { lean: true }, (error, result) => {
    if (error) reject(error);
    resolve(result);
  });
});

/** Find a temporary transaction document in the many collection.  // Verificate @returns!
 * This document is created to store temporary data for multiple transactions.
 * @param {string} id Document id.
 * @returns {Promise<{any: any, data: array}>}
 *  Transactions document with an array of id's in the data key.
 * */
exports.findTransactions = id => new Promise((resolve, reject) => {
  Many.findOne({ _id: id }, { data: 1 }, { lean: true }, (error, result) => {
    if (error) return reject(error);
    return resolve(result);
  });
});


// Save user(s)

/** Save user in the temporary collection.
 * @param {{any: any}} newUser User object as formed by the UserTemp schema.
 * @returns {Promise<{any}>} TempUser mongoose model.
 * */
exports.saveTempUser = newUser => new Promise(async (resolve, reject) => {
  const user = newUser;
  const payload = exports.payloadUserEmail(user);

  user.verificationToken = await exports.createToken(payload, verificationTokenExpires);
  user.usernameIndex = user.username.toLowerCase().trim();
  user.hash = await exports.hashPassword(user.password);
  user.type = userTypes.temp.value;

  UserTemp(user).save((error, result) => {
    if (error) reject(error);
    resolve(result);
  });
});

/** Save user in the permanent collection.
 * @param {{any: any}} userForm User object as formed by the User schema.
 * @returns {Promise<{any}>} User mongoose model.
 * */
exports.saveUser = userForm => new Promise((resolve, reject) => {
  User(userForm).save((error, result) => {
    if (error) reject(error);
    resolve(result);
  });
});

/** Update a single user.
 * @param {{any: any}} query Object search key + value.
 * @param {{any: any}} updateForm User object as formed by the User schema.
 * @returns {Promise<{n: number, nModified: number, ok: number}>} Status report.
 * */
exports.updateUser = (query, updateForm) => new Promise((resolve, reject) => {
  if (Object.keys(query).length === 0) { resolve(null); return; }

  User.update(query, { $set: updateForm }, { runValidators: true }, (error, result) => {
    if (error) reject(error);
    resolve(result);
  });
});

/** Save temporary transactions document.
 * @param {array} transactions Array of data to temporary store.
 * @returns {Promise<{n: number, nModified: number, ok: number}>} Status report.
 * */
exports.saveTransactions = transactions => new Promise((resolve, reject) => {
  const emptyArray = 'Empty array';
  if (transactions === 0) reject(emptyArray);

  const document = { data: transactions };

  Many(document).save((error, result) => {
    if (error) return reject(error);

    if (result) {
      return resolve({ id: result._id.toString() });
    }
    return reject();
  });
});

// Delete user(s)

/** Delete a single user.
 * @param {{any: any}} query Object search key + value.
 * @returns {Promise<{n: number, nModified: number, ok: number}>} Status report.
 * */
exports.deleteUser = query => new Promise((resolve, reject) => {
  if (Object.keys(query).length === 0) { resolve(null); return; }

  User.deleteOne(query, (error, result) => {
    if (error) reject(error);
    resolve(result);
  });
});

/** Delete a single temporary user.
 * @param {{any: any}} query Object search key + value.
 * @returns {Promise<{n: number, nModified: number, ok: number}>} Status report.
 * */
exports.deleteTempUser = query => new Promise((resolve, reject) => {
  if (Object.keys(query).length === 0) { resolve(null); return; }

  UserTemp.deleteOne(query, (error, result) => {
    if (error) reject(error);
    resolve(result);
  });
});

/** Delete multiple users.
 * @param {array} transactions Array of id's to delete.
 * @returns {Promise<{n: number, nModified: number, ok: number}>} Status report.
 * */
exports.deleteMany = transactions => new Promise((resolve, reject) => {
  User.deleteMany({ _id: { $in: transactions } }, (error, result) => {
    if (error) reject(error);
    resolve(result);
  });
});


// Passwords

/** Hash + salt password.
 * @param {string} password Password.
 * @returns {Promise<string>} Hashed password.
 * */
exports.hashPassword = password => new Promise((resolve, reject) => {
  hash(password, 10, (error, result) => {
    if (error) reject(error);
    resolve(result);
  });
});

/** Compare passwords.
 * @param {string} password Password.
 * @param {string} hashPassword Hashed password.
 * @returns {Promise<boolean>} Boolean.
 * */
exports.comparePasswords = (password, hashPassword) => new Promise((resolve, reject) => {
  compare(password, hashPassword, (error, res) => {
    if (error) reject(error);
    resolve(res);
  });
});


// ------------Tokens-------------------------

/** Create a login payload.
 * @param {{id: string, username: string, type: string}} user User document.
 * @returns {{user: string, username: string, type: string}} Payload object.
 * */
exports.payloadLogin = user => ({ user: user.id, username: user.username, type: user.type });

/** Create an email payload.
 * @param {{email: string}} user User email document.
 * @returns {{user: string}} Payload object.
 * */
exports.payloadUserEmail = user => ({ user: user.email });

/** Create a new JWT.
 * @param {{any}} payload Included data.
 * @param {string} expires 10m, 1d, ...
 * @param {string|number} [dbEntry] (Optional) Added to the secret.
 * @returns {string} Token.
 * */
exports.createToken = (payload, expires, dbEntry) => {
  let useSecret = secret;
  if (dbEntry) useSecret = secret2 + dbEntry;

  const token = jwt.sign(payload, useSecret, { expiresIn: expires });
  return token;
};

/** Creates two login-JWT's.
 * @param {{any}} payload Included data.
 * @param {string} hashPassword Added to the secret of the refreshtoken.
 * @returns {{Object: {token: string, refreshToken: string}}} Object with two tokens.
 * */
exports.createLoginTokens = (payload, hashPassword) => {
  const token = exports.createToken(payload, loginTokenExpires);
  const refreshToken = exports.createToken(payload, refreshTokenExpires, hashPassword);

  const tokens = { token, refreshToken };
  return tokens;
};

/** Verify a JWT.
 * @param {string} token Token.
 * @param {string|number} [dbEntry] (Optional) Added to the secret.
 * @returns {Promise<{Object}|false>} Payload as object or false if token is invalid.
 * */
exports.verifyToken = (token, dbEntry) => new Promise((resolve) => {
  let useSecret = secret;
  if (dbEntry) useSecret = secret2 + dbEntry;

  jwt.verify(token, useSecret, (error, decoded) => {
    if (error) resolve(false);
    resolve(decoded);
  });
});

/** Decodes a JWT. (Does not verify the token!)
 * @param {string} token Token.
 * @returns {{any}} Payload as object.
 * */
exports.decodeToken = token => jwt.decode(token);

/** Refresh JWT's with the refresh token.
 * @param {string} refreshToken Refresh token.
 * @returns {Promise<{Object: {token: string, refreshToken: string}}>|false}
 * Object with two new tokens or false if token is invalid.
 * */
exports.refreshTokens = async (refreshToken) => {
  const decoded = await exports.decodeToken(refreshToken);

  const user = await exports.findUser({ _id: decoded.user }, { username: 1, hash: 1, type: 1 });
  if (!user) return false;

  const verifiedRefreshToken = await exports.verifyToken(refreshToken, user.hash);
  if (!verifiedRefreshToken) return false;

  const payload = exports.payloadLogin(user);
  const newTokens = exports.createLoginTokens(payload, user.hash);
  if (!newTokens.token || !newTokens.refreshToken) return false;

  newTokens.userId = user.id;
  newTokens.userType = user.type;
  return newTokens;
};


// ------------Authentication middleware----------------

/** User authentication as middleware
 * @param {number} status Status code to return if tokens are not valid.
 * @returns {Promise} Calls next() or responds with the provided status.
 * */
exports.requiresUserAuth = (status, type) => async (req, res, next) => {
  const authError = { error: 'You\'re not logged in!' };
  const typeError = { error: 'You\'re not authorized' };

  const token = req.headers['x-token'];
  if (!token) return res.status(status).json(authError);

  const verifiedToken = await exports.verifyToken(token);
  if (verifiedToken) {
    if (verifiedToken.type < type) return res.status(status).json(typeError);
    req.userId = verifiedToken.user;
    req.userType = verifiedToken.type;
    return next();
  }

  const refreshToken = req.headers['x-refresh-token'];
  if (!refreshToken) return res.status(status).json(authError);

  const newTokens = await exports.refreshTokens(refreshToken);
  if (!newTokens) return res.status(status).json(authError);

  req.userId = newTokens.userId;
  req.userType = newTokens.userType;
  res.set('x-token', newTokens.token);
  res.set('x-refresh-token', newTokens.refreshToken);

  return next();
};
