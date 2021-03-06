// Imports
import { Request, Response } from 'express';
import { userTypes } from '../../database/models/users/user.schema';
import { UserDocumentLean, UserLogin, UserModel, UserQuery, UserRegister, UserUpdate } from '../../database/models/users/user.types';
import { accountDeleteSuccess, actionSuccess, blockedError, deleteError, duplicateError, loginError, loginSuccess, mailVerifyError, passwordLengthError, registrationSuccess, saveError, sendMailSuccess, updateError, updateSuccess, verifyDone, verifyError, verifySuccess } from '../../services/error-handler.service';
import { ReqQuery, RequestId } from '../../types/types';
import { passwordRecoveryMail, userEmailUpdateMail, userVerificationMail } from '../mail/mail.service';
import { spamHandler } from '../mail/spam.service';
import { checkLogin, comparePasswords, createEmailUpdateToken, createLoginTokens, createVerificationToken, decodeToken, verifyEmailUpdateToken, verifyToken } from './users.authentication';
import { deleteMany, deleteTempUser, deleteUser, findTransactions, findUserLean, findUsers, saveTempUser, saveTransactions, saveUser, updateMany, updateUser } from './users.database';
import { LoggedIn, PasswordRecovery } from './users.types';

// ------------- functions --------------

// Validation checks
async function userValidation(user: UserRegister | UserUpdate) {

  // Sync
  if (user.password && user.password.length > 59) { throw passwordLengthError; }

  // Async
  const check: Promise<boolean>[] = [];

  if (user.username) {
    check.push(checkDuplicate({ query: { username: user.username } }));
  }
  if (user.email) {
    check.push(checkDuplicate({ query: { username: user.email } }));
  }

  const exists = await Promise.all(check);
  if (exists.some(x => x === true)) { throw duplicateError; }
}

// Save a document for multiple actions
export async function userMany(req: RequestId) {
  const transactions: UserDocumentLean['_id'][] = req.body;

  const document = await saveTransactions(transactions);
  return document._id.toString() as string;
}

// Check for duplicates
export async function checkDuplicate(req: Request | ReqQuery) {
  const { query } = req;

  return findUserLean(query, { _id: 0, username: 1 })
    .then(() => true)
    .catch(() => false);
}

// Login
export async function logIn(req: Request, res: Response) {

  const loginForm: UserLogin = req.body;

  // Spam check
  if (loginForm.lname) { spamHandler('Login'); return loginSuccess; }

  const user = await findUserLean({ email: loginForm.email }).catch(() => { throw loginError; }) as UserDocumentLean;

  if (user.type.rank < 0) { throw blockedError; }
  if (user.type.rank === userTypes.tempUser.rank) { throw mailVerifyError; }

  const password = await comparePasswords(loginForm.password, user.password);
  if (!password) { throw loginError; }

  const tokens = createLoginTokens(user);

  res.set('x-token', tokens.token);
  res.set('x-refresh-token', tokens.refreshToken);

  return loginSuccess;
}

// Login check
export async function loginCheck(req: Request, res: Response) {

  const logInError = await checkLogin(req, res, 200, userTypes.user);

  if (logInError) { return { loggedIn: false } as LoggedIn; }
  return { loggedIn: true } as LoggedIn;
}

// Update user
export async function userUpdate(req: RequestId) {

  const _id = req._id;
  const updateForm: UserUpdate = req.body;
  const { origin } = req.headers;

  // Delete empty keys
  type keys = keyof UserUpdate;
  (Object.keys(updateForm) as keys[]).forEach(key => (updateForm[key] === null || updateForm[key] === '') && delete updateForm[key]);

  // Validation checks
  await userValidation(updateForm);

  // Email update
  if (updateForm.email) {

    const user = await findUserLean({ _id }) as UserDocumentLean;
    const verificationToken = createEmailUpdateToken(user, updateForm.email);

    // Send verificationmail to new address
    user.email = updateForm.email;
    await userEmailUpdateMail(user, origin as string, verificationToken);

    // Delete email key so the rest can be updated
    delete updateForm.email;
  }

  // Update the user
  const result = await updateUser({ _id }, updateForm);
  if (result.ok !== 1) { throw saveError; }

  return updateSuccess;
}

export async function updateEmail(req: RequestId) {

  if (!req.query.token) { throw verifyError; }

  // Find user from token
  const { token } = req.query;
  const decodedToken = decodeToken(token);
  const user = await findUserLean({ _id: decodedToken._id }, { _id: 1, email: 1 });

  // Verify the token
  const verifiedToken = await verifyEmailUpdateToken(token, user);
  if (!verifiedToken) { throw verifyError; }

  // Update email
  await updateUser({ _id: decodedToken._id }, { email: verifiedToken.newEmail });

  return updateSuccess;
}

export async function passwordRecovery(req: RequestId | ReqQuery) {

  const request: PasswordRecovery = req.body;

  const query: UserQuery = {};
  const { origin } = req.headers;

  if (request.email) { query.email = req.body.email; }
  if (request._id) { query._id = req.body.id; }

  const user = await findUserLean(query) as UserDocumentLean;
  if (user.type.rank === userTypes.tempUser.rank) { throw mailVerifyError; }

  const verificationToken = createVerificationToken(user);

  await passwordRecoveryMail(user, origin as string, verificationToken);

  return sendMailSuccess;
}

export async function updatePassword(req: RequestId) {

  if (!req.query.token) { throw verifyError; }

  const { token } = req.query;

  const decodedToken = decodeToken(token);

  const user = await findUserLean({ email: decodedToken.email }) as UserDocumentLean;

  const verifiedToken = await verifyToken(token);
  if (!verifiedToken) { throw verifyError; }

  req._id = user._id; // Input for userUpdate function
  return userUpdate(req);
}

export async function userBlockMany(req: Request) {

  const _id = req.params.id;

  const transactionDocument = await findTransactions(_id);
  const transactions = transactionDocument.data;
  const updateForm: UserUpdate = { type: userTypes.blockedUser };

  const result = await updateMany(transactions, updateForm);
  if (result.ok !== 1) { throw updateError; }

  return actionSuccess;

}

export async function userUnblockMany(req: Request) {

  const _id = req.params.id;

  const transactionDocument = await findTransactions(_id);
  const transactions = transactionDocument.data;
  const updateForm: UserUpdate = { type: userTypes.user };

  const result = await updateMany(transactions, updateForm);
  if (result.ok !== 1) { throw updateError; }

  return actionSuccess;

}

export async function makeAdminMany(req: Request) {

  const _id = req.params.id;

  const transactionDocument = await findTransactions(_id);
  const transactions = transactionDocument.data;
  const updateForm: UserUpdate = { type: userTypes.admin };

  const result = await updateMany(transactions, updateForm);
  if (result.ok !== 1) { throw updateError; }

  return actionSuccess;

}

export async function makeUserMany(req: Request) {

  const _id = req.params.id;

  const transactionDocument = await findTransactions(_id);
  const transactions = transactionDocument.data;
  const updateForm: UserUpdate = { type: userTypes.user };

  const result = await updateMany(transactions, updateForm);
  if (result.ok !== 1) { throw updateError; }

  return actionSuccess;

}

// Delete user
export async function userDelete(req: RequestId) {

  const { _id } = req;

  const result = await deleteUser({ _id });
  if (result.n !== 1) { throw deleteError; }

  return accountDeleteSuccess;
}

export async function userDeleteMany(req: RequestId) {
  const deleteManyId = req.params.id;

  const transactionDocument = await findTransactions(deleteManyId);
  const transactions = transactionDocument.data;

  const result = await deleteMany(transactions);
  if (result.ok !== 1) { throw deleteError; }

  return actionSuccess;
}

// Register user
export async function registerUser(req: RequestId) {

  const userForm: UserRegister = req.body;
  const { origin } = req.headers;

  // Spam check
  if (userForm.lname) { spamHandler('Registration'); return registrationSuccess; }

  await userValidation(userForm);

  // Convert to user model
  const user = userForm as UserModel;
  user.type = userTypes.tempUser;

  // Save as temporary
  const savedTempUser = await saveTempUser(user);

  // Convert to user lean model
  const tempUser: UserDocumentLean = savedTempUser.toObject();

  // Send mail verification
  const verificationToken = createVerificationToken(tempUser);
  await userVerificationMail(tempUser, origin as string, verificationToken)
    // Catch error to delete temp user on errors
    .catch(error => {
      deleteTempUser({ _id: savedTempUser._id });
      throw error;
    });

  return registrationSuccess;
}

// Verify email user
export async function verifyEmail(req: RequestId) {

  const { token } = req.query;

  const verifiedToken = await verifyToken(token);
  if (!verifiedToken) { throw verifyError; }

  const userTemp = await findUserLean({ email: verifiedToken.email }) as UserDocumentLean;

  if (userTemp.type.rank >= userTypes.user.rank) { return verifyDone; }

  userTemp.type = userTypes.user;

  await saveUser(userTemp);
  deleteTempUser({ _id: userTemp._id });

  return verifySuccess;
}

// Resend verification email
export async function resendEmailVerification(req: Request) {

  const email = req.body.email;
  const { origin } = req.headers;

  const tempUser = await findUserLean({ email: email }) as UserDocumentLean;

  const verificationToken = createVerificationToken(tempUser);

  await userVerificationMail(tempUser, origin as string, verificationToken);

  return registrationSuccess;
}

// User queries
export async function userInfo(req: RequestId) {
  const { _id } = req;

  return findUserLean({ _id }, { _id: 0, password: 0, usernameIndex: 0 });
}

export async function userGetAll(req: RequestId) {

  if (req.type.rank === userTypes.superAdmin.rank) {
    return findUsers({ 'type.rank': { $lt: userTypes.superAdmin.rank } }, { password: 0, usernameIndex: 0 });

  } else if (req.type.rank === userTypes.developer.rank) {
    return findUsers({ 'type.rank': { $lt: userTypes.developer.rank } }, { password: 0, usernameIndex: 0 });
  }

  return findUsers({ 'type.rank': { $lt: userTypes.admin.rank } }, { password: 0, usernameIndex: 0 });
}

// Mock user
export async function mockUser(req: RequestId) {
  const user = req.body;

  const exists = await Promise.all([
    checkDuplicate({ query: { username: user.username } }),
    checkDuplicate({ query: { email: user.email } })
  ]);

  if (exists.some(x => x === true)) { throw duplicateError; }

  user.type = userTypes.user;

  await saveUser(user);

  return registrationSuccess;
}

// ----------------------------

