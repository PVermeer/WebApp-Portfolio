const config = require('../config.json');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Q = require('q');
const mongo = require('mongoskin');

const db = mongo.db(config.connectionString, {
  native_parser: true,
});

db.bind('users');

const service = {};
const deferred = Q.defer();

function authenticate(username, password) {
  db.users.findOne({ username }, (err, user) => {
    if (err) { deferred.reject(`${err.name}: ${err.message}`); }
    // authentication successful
    if (user && bcrypt.compareSync(password, user.hash)) {
      deferred.resolve({
        _id: user._id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        token: jwt.sign({
          sub: user._id,
        }, config.secret),
      });
    } else {
      // authentication failed
      deferred.resolve();
    }
  });
  return deferred.promise;
}

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

function create(userParam) {
  function createUser() {
    // set user object to userParam without the cleartext password
    const user = _.omit(userParam, 'password');
    // add hashed password to user object
    user.hash = bcrypt.hashSync(userParam.password, 10);
    db.users.insert(user, (err) => {
      if (err) deferred.reject(`${err.name}: ${err.message}`);
      deferred.resolve();
    });
  }

  // validation
  db.users.findOne({ username: userParam.username }, (err, user) => {
    if (err) deferred.reject(`${err.name}: ${err.message}`);
    // username already exists
    if (user) {
      deferred.reject(`Username "${userParam.username}" is already taken`);
    } else {
      createUser();
    }
  });
  return deferred.promise;
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

service.authenticate = authenticate;
service.getAll = getAll;
service.getById = getById;
service.create = create;
service.update = update;
service.delete = _delete;

module.exports = service;
