const _ = require('lodash');
// const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Q = require('q');
const mongo = require('mongoskin');
// const mongoose = require('mongoose');

const db = '';
const service = {};
const deferred = Q.defer();

const User = require('../database/models/user');

// function authenticate(username, password) {
//   db.users.findOne({ username }, (err, user) => {
//     if (err) { deferred.reject(`${err.name}: ${err.message}`); }
//     // authentication successful
//     if (user && bcrypt.compareSync(password, user.hash)) {
//       deferred.resolve({
//         _id: user._id,
//         username: user.username,
//         firstName: user.firstName,
//         lastName: user.lastName,
//         token: jwt.sign({
//           sub: user._id,
//         }, config.secret),
//       });
//     } else {
//       // authentication failed
//       deferred.resolve();
//     }
//   });
//   return deferred.promise;
// }

function getAll() {
  db.users.find().toArray((err, users) => {
    if (err) { deferred.reject(`${err.name}: ${err.message}`); }
    // return users (without hashed passwords)
    const usersArray = _.map(users, user => _.omit(user, 'hash'));
    deferred.resolve(usersArray);
  });
  return deferred.promise;
}

function getById(_id) {
  db.users.findById(_id, (err, user) => {
    if (err) deferred.reject(`${err.name}: ${err.message}`);
    if (user) {
      // return user (without hashed password)
      deferred.resolve(_.omit(user, 'hash'));
    } else {
      // user not found
      deferred.resolve();
    }
  });
  return deferred.promise;
}

// /check query string
function checkExistence(query) {
  return new Promise((resolve, reject) => {
    const matchError = 'Whoops, not a matching query string... :(';
    if (query.username) {
      return User.findOne(
        { usernameIndex: query.username },
        { usernameIndex: 1, _id: 0 }, (error, user) => {
          if (!user) resolve(null);
          if (user) resolve(user.usernameIndex);
          if (error) reject(error);
        },
      );
    }
    if (query.email) {
      return User.findOne(
        { email: query.email },
        { email: 1, _id: 0 }, (error, user) => {
          if (!user) resolve(null);
          if (user) resolve(user.email);
          if (error) reject(error);
        },
      );
    }
    return reject(matchError);
  });
}

function create(userForm) {
  return new Promise((resolve, reject) => {
    const username = { username: userForm.username };
    const email = { email: userForm.email };
    const duplicateError = 'Username / Email already exists';
    const successMsg = 'Whoopie, registration successful!';

    // Check for duplicates in case client validation fails
    const promiseArray = [
      checkExistence(username),
      checkExistence(email),
    ];

    // Check for null resolves
    Promise.all(promiseArray).then((values) => {
      if (values.every(x => x === null)) {
        // Create new User
        const user = userForm;
        user.hash = bcrypt.hashSync(userForm.password, 10);
        User(user).save((error) => {
          if (error) reject(error);
          resolve(successMsg);
        });
      } else reject(duplicateError);
    });
  });
}

function update(_id, userParam) {
  function updateUser() {
    // fields to update
    const set = {
      firstName: userParam.firstName,
      lastName: userParam.lastName,
      username: userParam.username,
    };
    // update password if it was entered
    if (userParam.password) {
      set.hash = bcrypt.hashSync(userParam.password, 10);
    }
    db.users.update(
      { _id: mongo.helper.toObjectID(_id) },
      { $set: set },
      (err) => {
        if (err) { deferred.reject(`${err.name}: ${err.message}`); }
        deferred.resolve();
      },
    );
  }

  // validation
  db.users.findById(_id, (err, user) => {
    if (err) { deferred.reject(`${err.name}: ${err.message}`); }
    if (user.username !== userParam.username) {
      // username has changed so check if the new username is already taken
      db.users.findOne({ username: userParam.username }, () => {
        if (err) { deferred.reject(`${err.name}: ${err.message}`); }
        if (user) {
          // username already exists
          deferred.reject(`Username "${userParam.username}" is already taken`);
        } else { updateUser(); }
      });
    } else { updateUser(); }
  });
  return deferred.promise;
}

// Remove later after testing
/* eslint-disable no-underscore-dangle */
function _delete(_id) {
  db.users.remove({ _id: mongo.helper.toObjectID(_id) }, (err) => {
    if (err) { deferred.reject(`${err.name}: ${err.message}`); }
    deferred.resolve();
  });
  return deferred.promise;
}
/* eslint-enable no-underscore-dangle */

// service.authenticate = authenticate;
service.getAll = getAll;
service.getById = getById;
service.create = create;
service.update = update;
service.delete = _delete;
service.checkExistence = checkExistence;

module.exports = service;
