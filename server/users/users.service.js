
const {
  findUser, hashPassword, saveTempUser, comparePasswords, createLoginTokens, createToken,
  verifyToken, decodeToken, saveUser, deleteTempUser, updateUser, deleteUser, saveTransactions,
  findTransactions, deleteMany, findAllUsers, payloadLogin, payloadUserEmail,
} = require('./auth.service');
const { passwordRecoveryTokenExpires } = require('../config.json');
const { userVerificationMail, passwordRecoveryMail } = require('../mail/mail.service');
const { userTypes } = require('../database/models/user');

// Reject error messages (status !200)
const checkDuplicateError = 'Whoops, not a matching query string... :(';
const tokenError = 'Whoops, couldn\'t create tokens';
const saveError = 'Could not save to the database';
const verifyError = 'Verification has expired, this means you\'re already verified or you waited too long...';
const mailError = 'Oh ow... Could not send e-mail';
const mailVerifyError = 'Your e-mail has not been verified, please check your inbox or spambox.';
const deleteError = 'Could not delete user from the database';

// Error messages (status 200)
const loginError = { error: 'Oh, ow.. Username or password is incorrect' };
const duplicateError = { error: 'Username / Email already exists' };
const findError = { error: 'Document not found' };
const userFindError = { error: 'User not found' };

// Success messages
const registrationSuccess = { success: 'Whoopie, registration successful!' };
const loginSuccess = { success: 'Whoopie, login successful!' };
const updateSuccess = { success: 'Whoopie, update successful!' };
const verifySuccess = { success: 'E-mail verified!' };
const verifyDone = { success: 'E-mail already verified!' };
const actionSuccess = { success: 'Action successful' };

// --------------functions--------------

// Check for duplicates
exports.checkDuplicate = async (query) => {
  const user = await findUser(query, { _id: 0, username: 1 });
  if (!user) return null;
  if (user) return 'true';
  return Promise.reject(checkDuplicateError);
};

// Login
exports.logIn = async (loginForm, res) => {
  const user = await findUser({ email: loginForm.email }, { hash: 1, username: 1, type: 1 });
  if (!user) return loginError;

  const password = await comparePasswords(loginForm.password, user.hash);
  if (!password) return loginError;

  if (user.type === userTypes.temp.value) return res.status(403).send(mailVerifyError);

  const payload = payloadLogin(user);
  const tokens = await createLoginTokens(payload, user.hash);
  if (!tokens) return Promise.reject(tokenError);

  res.set('x-token', tokens.token);
  res.set('x-refresh-token', tokens.refreshToken);

  return loginSuccess;
};

// User password recovery
exports.passwordRecovery = async (req) => {
  const query = {};
  if (req.body.email) query.email = req.body.email;
  if (req.body.id) query._id = req.body.id;
  const { origin } = req.headers;

  const user = await findUser(query, { _id: 0 });
  if (!user) return userFindError;

  const payload = payloadUserEmail(user);
  const verificationToken = await createToken(payload, passwordRecoveryTokenExpires, user.hash);
  if (!verificationToken) return Promise.reject(tokenError);

  const sendPasswordRecoveryMail = await passwordRecoveryMail(user, origin, verificationToken);
  if (!sendPasswordRecoveryMail) return Promise.reject(mailError);

  return sendPasswordRecoveryMail;
};

exports.updatePassword = async (req) => {
  if (!req.query.token) return Promise.reject(verifyError);
  const { token } = req.query;

  const decodedToken = decodeToken(token);
  const user = await findUser({ email: decodedToken.user }, { hash: 1 });
  if (!user) return Promise.reject(verifyError);

  const verifiedToken = await verifyToken(token, user.hash);
  if (!verifiedToken) return Promise.reject(verifyError);

  req.userId = user.id; // Input for userUpdate function
  return exports.userUpdate(req);
};

// Register user
exports.register = async (req) => {
  const user = req.body;
  const { origin } = req.headers;
  user.usernameIndex = user.username.toLowerCase().trim();

  const exists = await Promise.all([
    exports.checkDuplicate({ username: user.usernameIndex }),
    exports.checkDuplicate({ email: user.email }),
  ]);

  if (exists.some(x => x !== null)) { return duplicateError; }

  user.hash = await hashPassword(user.password);
  user.type = userTypes.temp.value;

  const savedTempUser = await saveTempUser(user);
  if (!savedTempUser) return Promise.reject(saveError);

  const sendVerificationMail = await userVerificationMail(savedTempUser, origin);
  if (!sendVerificationMail) return Promise.reject(mailError);

  return registrationSuccess;
};

// Verify email
exports.verifyEmail = async (req) => {
  const { token } = req.query;

  const verifiedToken = await verifyToken(token);
  if (!verifiedToken) return Promise.reject(verifyError);

  const userTemp = await findUser({ email: verifiedToken.user });
  if (!userTemp) return Promise.reject(verifyError);
  if (userTemp.type === userTypes.user.value) return verifyDone;

  userTemp.type = userTypes.user.value;

  const user = await saveUser(userTemp);
  if (!user) return Promise.reject(saveError);

  deleteTempUser({ email: userTemp.email });

  return verifySuccess;
};

// User queries
exports.userInfo = async (req) => {
  const { userId } = req;

  const user = await findUser({ _id: userId }, { _id: 0, hash: 0, usernameIndex: 0 });
  if (!user) return findError;

  return user;
};

// Update user
exports.userUpdate = async (req) => {
  const updateForm = req.body;
  Object.keys(updateForm).forEach((key => (updateForm[key] === null || '') && delete updateForm[key]));
  const { userId } = req;

  const exists = [];
  if (updateForm.username) {
    exists.push(await exports.checkDuplicate({ username: updateForm.username }));
  }
  if (updateForm.email) {
    exists.push(await exports.checkDuplicate({ email: updateForm.email }));
  }

  if (exists.some(x => x !== null)) {
    return duplicateError;
  }

  if (updateForm.username) updateForm.usernameIndex = updateForm.username.toLowerCase().trim();
  if (updateForm.password) updateForm.hash = await hashPassword(updateForm.password);

  const result = await updateUser({ _id: userId }, updateForm);
  if (!result) return saveError;
  return updateSuccess;
};

exports.userDelete = async (req) => {
  let { userId } = req;
  if (req.userType === 'admin' && req.params.id) userId = req.params.id;

  const result = await deleteUser({ _id: userId });
  if (result.n === 0) return Promise.reject(deleteError);
  return actionSuccess;
};

exports.userMany = async (req) => {
  const transactions = req.body;

  const result = await saveTransactions(transactions);
  if (!result) return Promise.reject(saveError);

  return result;
};

exports.userDeleteMany = async (req) => {
  const deleteManyId = req.params.id;

  const transactionDocument = await findTransactions(deleteManyId);
  if (!transactionDocument) return findError;

  const transactions = transactionDocument.data;
  const transactionsLength = transactions.length;

  const result = await deleteMany(transactions);

  if (result.n !== transactionsLength) return { error: result };
  return actionSuccess;
};

exports.userResetPasswordMany = async (req) => {
  const resetPasswordManyId = req.params.id;

  const transactionDocument = await findTransactions(resetPasswordManyId);
  if (!transactionDocument) return findError;

  const transactions = transactionDocument.data;

  const result = await Promise.all(transactions.map(async (id) => {
    const user = { body: { id }, headers: req.headers };
    const response = await exports.passwordRecovery(user);
    return { id, response };
  }));

  return result;
};

exports.userGetAll = async () => {
  const users = await findAllUsers({ hash: 0 });
  if (users.length === 0) return findError;

  return users;
};

// Mock user
exports.mockUser = async (req) => {
  const user = req.body;

  const exists = await Promise.all([
    exports.checkDuplicate({ username: user.username }),
    exports.checkDuplicate({ email: user.email }),
  ]);

  if (exists.some(x => x !== null)) { return duplicateError; }

  user.usernameIndex = user.username.toLowerCase().trim();
  user.hash = await hashPassword(user.password);
  user.type = userTypes.user.value;

  const savedUser = await saveUser(user);
  if (!savedUser) return Promise.reject(saveError);

  return registrationSuccess;
};
