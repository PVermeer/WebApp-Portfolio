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

// /user?check query
function checkExistence(query) {
  return new Promise((resolve, reject) => {

    const key = Object.keys(query);
    const switchError = 'Whoops, no matching query... :(';

    switch (key[0]) {
      case 'username':
        User.findOne({ usernameIndex: query.username }, (error, user) => {
          if (!user) { resolve(null); }
          if (user) { resolve(user.usernameIndex); }
          if (error) { reject(error); }
        });
        break;
      case 'email':
        User.findOne({ email: query.email }, (error, user) => {
          if (!user) { resolve(null); }
          if (user) { resolve(user.email); }
          if (error) { reject(error); }
        });
        break;
      default:
        reject(switchError);
    }
  });
}

function create(userParam) {
  return new Promise((resolve, reject) => {
    function createUser() {
      const user = userParam;
      user.hash = bcrypt.hashSync(userParam.password, 10);
      User(user).save((error) => {
        if (error) reject(error);
        resolve();
      });
    }
    createUser();
    // validation
    // User.findOne({ username: userParam.username }, (error, user) => {
    //   if (error) reject(error);
    //   if (user) reject(error);
    //   else createUser();
    // });
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
