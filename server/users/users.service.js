// Auth services
const {
  createTokens, comparePasswords, hashPassword, findUserByEmail,
  findUserByUsername, saveTempUser, saveUser, updateUser, verifyToken, refreshTokens,
  deleteTempUserByEmail, findUserById,
} = require('./auth.service');

const { userVerificationMail } = require('../mail/mail.service');

// Exports
const userService = {};

// User types
const userTypes = {
  temp: 'usertemp',
  saved: 'user',
};

// Reject error messages (status !200)
const checkDuplicateError = 'Whoops, not a matching query string... :(';
const tokenError = 'Whoops, couldn\'t create tokens';
const saveUserError = 'Could not save user to the database';
const verifyError = 'Verification has expired, this means you\'re already verified or you waited too long...';
const verificationMailError = 'Oh ow... Could not send verification mail';
const mailVerifyError = 'Your e-mail has not been verified, please check your inbox or spambox.';

// Error messages (status 200)
const loginError = { error: 'Oh, ow.. Username or password is incorrect' };
const duplicateError = { error: 'Username / Email already exists' };
const loginCheckError = { error: 'Not logged in' };
const findUserError = { error: 'User not found' };

// Success messages
const registrationSuccess = { success: 'Whoopie, registration successful!' };
const loginSuccess = { success: 'Whoopie, login successful!' };
const updateSuccess = { success: 'Whoopie, update successful!' };
const loginCheckSuccess = { success: 'Logged in' };
const verifySuccess = { success: 'E-mail verified!' };

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

  if (user.type === userTypes.temp) return res.status(403).send(mailVerifyError);

  const tokens = await createTokens(user._id, user.type, user.hash);
  if (!tokens) return Promise.reject(tokenError);

  res.set('x-token', tokens.token);
  res.set('x-refresh-token', tokens.refreshToken);

  return loginSuccess;
}

// Register user
async function register(req) {
  const user = req.body;
  const { origin } = req.headers;

  const exists = await Promise.all([
    checkDuplicate({ username: user.username }),
    checkDuplicate({ email: user.email }),
  ]);

  if (exists.some(x => x !== null)) { return duplicateError; }

  user.usernameIndex = user.username.toLowerCase().trim();
  user.hash = await hashPassword(user.password);
  user.type = userTypes.temp;

  const savedTempUser = await saveTempUser(user);
  if (!savedTempUser) return Promise.reject(saveUserError);

  const sendVerificationMail = await userVerificationMail(savedTempUser, origin);
  if (!sendVerificationMail) return Promise.reject(verificationMailError);

  return registrationSuccess;
}

// Verify email
async function verifyEmail(req) {
  const token = req.query.user;

  const verifiedToken = await verifyToken(token);
  if (!verifiedToken) return Promise.reject(verifyError);

  const userTemp = await findUserByEmail(verifiedToken.user);
  if (!userTemp) return Promise.reject(verifyError);
  if (userTemp.type === userTypes.saved) return verifySuccess;

  userTemp.type = userTypes.saved;

  const user = await saveUser(userTemp);
  if (!user) return Promise.reject(saveUserError);

  await deleteTempUserByEmail(userTemp.email);

  return verifySuccess;
}

// Login check
async function loginCheck(req, res) {
  const token = req.headers['x-token'];
  if (!token) return loginCheckError;

  const verifiedToken = await verifyToken(token);
  if (verifiedToken) { req.userId = verifiedToken.user; return loginCheckSuccess; }

  const refreshToken = req.headers['x-refresh-token'];
  if (!refreshToken) return loginCheckError;

  const newTokens = await refreshTokens(refreshToken);
  if (!newTokens) return loginCheckError;

  req.UserId = newTokens.userId;
  res.set('x-token', newTokens.token);
  res.set('x-refresh-token', newTokens.refreshToken);

  return loginCheckSuccess;
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

  const user = findUserById(userId, { _id: 0, hash: 0, usernameIndex: 0 });
  if (!user) return findUserError;

  return user;
}

userService.checkDuplicate = checkDuplicate;
userService.logIn = logIn;
userService.register = register;
userService.verifyEmail = verifyEmail;
userService.loginCheck = loginCheck;
userService.userUpdate = userUpdate;
userService.userInfo = userInfo;

module.exports = userService;
