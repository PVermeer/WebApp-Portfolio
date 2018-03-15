// Auth services
const {
  createTokens, comparePasswords, hashPassword, findUserByEmail,
  findUserByUsername, saveUser,
} = require('./auth.service');

// Models
const { User } = require('../database/models/user');

// Exports
const userService = {};

// Reject error messages (status !200)
const checkDuplicateError = 'Whoops, not a matching query string... :(';
const tokenError = 'Whoops, couldn\'t create tokens';

// Error messages (status 200)
const loginError = { error: 'Oh, ow.. Username or password is incorrect' };
const duplicateError = { error: 'Username / Email already exists' };
const saveUserError = { error: 'Could not save user to the database' };

// Success messages
const registrationSuccess = { success: 'Whoopie, registration successful!' };
const loginSuccess = { success: 'Whoopie, registration successful!' };


// --------------functions--------------

// Check for duplicates as validation in register form
async function checkDuplicate(query) {
  if (query.username) {
    const user = await findUserByUsername(query.username, { username: 1, _id: 0 });
    if (!user) return null;
    if (user) return user.username;
  }
  if (query.email) {
    const user = await findUserByEmail(query.email, { email: 1, _id: 0 });
    if (!user) return null;
    if (user) return user.email;
  }
  return Promise.reject(checkDuplicateError);
}

// Login
async function logIn(loginForm, res) {
  const user = await findUserByEmail(loginForm.email, { hash: 1, type: 1 });
  if (!user) return loginError;

  const password = await comparePasswords(loginForm.password, user.hash);
  if (!password) return loginError;

  const tokens = await createTokens(user._id, user.type, user.hash);
  if (!tokens) return Promise.reject(tokenError);

  res.set('x-token', tokens.token);
  res.set('x-refresh-token', tokens.refreshToken);

  return loginSuccess;
}

// Register user
async function register(userForm) {
  const user = userForm;

  const exists = await Promise.all([
    checkDuplicate({ username: userForm.username }),
    checkDuplicate({ email: userForm.email }),
  ]);

  if (exists.every(x => x !== null)) return duplicateError;

  user.hash = await hashPassword(userForm.password);

  await saveUser(user);
  if (!user) return saveUserError;
  return registrationSuccess;
}

async function userInfo() {
  const query = { username: 'henkie' };
  return User.findOne(
    { usernameIndex: query.username },
    { _id: 0, hash: 0 },
    async (error, user) => {
      if (await error) return error;
      return user;
    },
  );
}

userService.logIn = logIn;
userService.register = register;
userService.checkDuplicate = checkDuplicate;
userService.userInfo = userInfo;

module.exports = userService;
