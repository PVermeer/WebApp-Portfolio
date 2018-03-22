// Auth services
const {
  createTokens, comparePasswords, hashPassword, findUserByEmail,
  findUserByUsername, saveUser, updateUser,
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
const loginSuccess = { success: 'Whoopie, login successful!' };
const updateSuccess = { success: 'Whoopie, update successful!' };


// --------------functions--------------

// Check for duplicates
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

  if (exists.some(x => x !== null)) { return duplicateError; }

  user.usernameIndex = user.username.toLowerCase().trim();
  user.hash = await hashPassword(userForm.password);

  const savedUser = await saveUser(user);
  if (!savedUser) return saveUserError;

  return registrationSuccess;
}

// Update user
async function userUpdate(req) {
  const updateForm = req.body;
  Object.keys(updateForm).forEach((key => (updateForm[key] === null || '') && delete updateForm[key]));
  const { userId } = req;

  const exists = [];
  if (updateForm.username) exists.push(await checkDuplicate({ username: updateForm.username }));
  if (updateForm.email) exists.push(await checkDuplicate({ email: updateForm.email }));

  if (exists.some(x => x !== null)) {
    return duplicateError;
  }

  if (updateForm.username) updateForm.usernameIndex = updateForm.username.toLowerCase().trim();
  if (updateForm.password) updateForm.hash = await hashPassword(updateForm.password);

  const result = await updateUser(updateForm, userId);
  if (!result) return saveUserError;
  return updateSuccess;
}

function userInfo(req) {
  const { userId } = req;
  return User.findOne(
    { _id: userId },
    { _id: 0, hash: 0, usernameIndex: 0 },
    (error, user) => {
      if (error) return error;
      return user;
    },
  );
}

userService.checkDuplicate = checkDuplicate;
userService.logIn = logIn;
userService.register = register;
userService.userUpdate = userUpdate;
userService.userInfo = userInfo;

module.exports = userService;
