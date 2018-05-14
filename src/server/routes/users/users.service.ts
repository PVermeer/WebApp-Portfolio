// Imports
import {
  deleteMany, deleteUser, findTransactions,
  saveTempUser, saveTransactions, saveUser, updateUser, findUserLean, updateMany, deleteTempUser, findUsers
} from './users.database';
import {
  comparePasswords, createLoginTokens, decodeToken, verifyToken, createVerificationToken, verifyRefreshToken,
  createEmailUpdateToken, verifyEmailUpdateToken,
} from './users.authentication';
import { userTypes } from '../../database/models/users/user.schema';
import { spamHandler } from '../mail/spam.service';
import { Request, Response } from 'express';
import { userVerificationMail, passwordRecoveryMail, userEmailUpdateMail } from '../mail/mail.service';
import { UserUpdate, UserQuery, UserDocumentLean, UserLogin, UserRegister, UserModel } from '../../database/models/users/user.types';
import { RequestId, ReqQuery, PasswordRecovery } from './users.types';
import { ManyDocumentLean } from '../../database/models/users/many.types';
import {
  passwordLengthError, duplicateError, blockedError, mailVerifyError, loginError, saveError,
  verifyError, updateError, deleteError, loginSuccess, updateSuccess, sendMailSuccess,
  actionSuccess, deleteSuccess, registrationSuccess, verifyDone, verifySuccess,
} from '../../services/error-handler.service';

// ------------- functions --------------

// Validation checks
async function userValidation(user: UserRegister | UserUpdate): Promise<void> {

  // Sync
  if (user.password) {
    if (user.password.length > 59) { throw passwordLengthError; }
  }

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
export async function userMany(req: RequestId): Promise<ManyDocumentLean> {
  const transactions: UserDocumentLean['_id'][] = req.body;

  const document = await saveTransactions(transactions);
  return document._id.toString();
}

// Check for duplicates
export async function checkDuplicate(req: Request | ReqQuery): Promise<boolean> {
  const { query } = req;

  return findUserLean(query, { _id: 0, username: 1 })
    .then(() => true)
    .catch(() => false);
}

// Login
export async function logIn(req: Request, res: Response): Promise<string> {

  const loginForm: UserLogin = req.body;

  // Spam check
  if (loginForm.lname) { spamHandler('Login'); return loginSuccess; }

  const user = await findUserLean({ email: loginForm.email });

  if (user.type.rank < 0) { throw blockedError; }
  if (user.type.rank < 1) { throw mailVerifyError; }

  const password = await comparePasswords(loginForm.password, user.password);
  if (!password) { throw loginError; }

  const tokens = createLoginTokens(user);

  res.set('x-token', tokens.token);
  res.set('x-refresh-token', tokens.refreshToken);

  return loginSuccess;
}

// Login check
export async function loginCheck(): Promise<string> {
  return loginSuccess;
}

// Update user
export async function userUpdate(req: RequestId): Promise<string> {

  const _id = req.userId;
  const updateForm: UserUpdate = req.body;
  const { origin } = req.headers;

  // Delete empty keys
  type keys = keyof UserUpdate;
  (Object.keys(updateForm) as keys[]).forEach(key => (updateForm[key] === null || updateForm[key] === '') && delete updateForm[key]);

  // Validation checks
  await userValidation(updateForm);

  // Email update
  if (updateForm.email) {

    const user = await findUserLean({ _id });
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

export async function updateEmail(req: RequestId): Promise<string> {

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

export async function passwordRecovery(req: RequestId | ReqQuery): Promise<string> {

  const request: PasswordRecovery = req.body;

  const query: UserQuery = {};
  const { origin } = req.headers;

  if (request.email) { query.email = req.body.email; }
  if (request._id) { query._id = req.body.id; }

  const user = await findUserLean(query);
  if (user.type.rank < 1) { throw mailVerifyError; }

  const verificationToken = createVerificationToken(user);

  await passwordRecoveryMail(user, origin as string, verificationToken);

  return sendMailSuccess;
}

export async function updatePassword(req: RequestId): Promise<string> {

  if (!req.query.token) { throw verifyError; }

  const { token } = req.query;

  const decodedToken = decodeToken(token);

  const user = await findUserLean({ email: decodedToken.email });

  const verifiedToken = await verifyRefreshToken(token, user);
  if (!verifiedToken) { throw verifyError; }

  req.userId = user._id; // Input for userUpdate function
  return userUpdate(req);
}

export async function userBlockMany(req: Request): Promise<string> {

  const _id = req.params.id;

  const transactionDocument = await findTransactions(_id);
  const transactions = transactionDocument.data;
  const updateForm: UserUpdate = { type: userTypes.blockedUser };

  const result = await updateMany(transactions, updateForm);
  if (result.ok !== 1) { throw updateError; }

  return actionSuccess;

}

export async function userUnblockMany(req: Request): Promise<string> {

  const _id = req.params.id;

  const transactionDocument = await findTransactions(_id);
  const transactions = transactionDocument.data;
  const updateForm: UserUpdate = { type: userTypes.user };

  const result = await updateMany(transactions, updateForm);
  if (result.ok !== 1) { throw updateError; }

  return actionSuccess;

}

export async function makeAdminMany(req: Request): Promise<string> {

  const _id = req.params.id;

  const transactionDocument = await findTransactions(_id);
  const transactions = transactionDocument.data;
  const updateForm: UserUpdate = { type: userTypes.admin };

  const result = await updateMany(transactions, updateForm);
  if (result.ok !== 1) { throw updateError; }

  return actionSuccess;

}

export async function makeUserMany(req: Request): Promise<string> {

  const _id = req.params.id;

  const transactionDocument = await findTransactions(_id);
  const transactions = transactionDocument.data;
  const updateForm: UserUpdate = { type: userTypes.user };

  const result = await updateMany(transactions, updateForm);
  if (result.ok !== 1) { throw updateError; }

  return actionSuccess;

}

// Delete user
export async function userDelete(req: RequestId): Promise<string> {

  const { userId } = req;

  const result = await deleteUser({ _id: userId });
  if (result.n !== 1) { throw deleteError; }

  return deleteSuccess;
}

export async function userDeleteMany(req: RequestId): Promise<string> {
  const deleteManyId = req.params.id;

  const transactionDocument = await findTransactions(deleteManyId);
  const transactions = transactionDocument.data;

  const result = await deleteMany(transactions);
  if (result.ok !== 1) { throw deleteError; }

  return actionSuccess;
}

// Register user
export async function registerUser(req: RequestId): Promise<string> {

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
export async function verifyEmail(req: RequestId): Promise<string> {

  const { token } = req.query;

  const verifiedToken = await verifyToken(token);
  if (!verifiedToken) { throw verifyError; }

  const userTemp = await findUserLean({ email: verifiedToken.email });

  if (userTemp.type.rank >= userTypes.user.rank) { return verifyDone; }

  userTemp.type = userTypes.user;

  await saveUser(userTemp);
  deleteTempUser({ _id: userTemp._id });

  return verifySuccess;
}

// Resend verification email
export async function resendEmailVerification(req: Request): Promise<string> {

  const email = req.body.email;
  const { origin } = req.headers;

  const tempUser = await findUserLean({ email: email });

  const verificationToken = createVerificationToken(tempUser);

  await userVerificationMail(tempUser, origin as string, verificationToken);

  return registrationSuccess;
}

// User queries
export async function userInfo(req: RequestId): Promise<Partial<UserDocumentLean>> {
  const { userId } = req;

  return findUserLean({ _id: userId }, { _id: 0, password: 0, usernameIndex: 0 });
}

export async function userGetAll(req: RequestId): Promise<Partial<UserDocumentLean[]>> {

  if (req.type.rank === userTypes.superAdmin.rank) {
    return findUsers({ 'type.rank': { $lt: userTypes.superAdmin.rank }}, { password: 0, usernameIndex: 0 });
  }

  return findUsers({ 'type.rank': { $lt: userTypes.admin.rank }}, { password: 0, usernameIndex: 0 });
}

// Mock user
export async function mockUser(req: RequestId): Promise<string> {
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

