// Imports
import {
  deleteMany, deleteTempUser, deleteUser, findAllUsers, findTransactions, findUser,
  saveTempUser, saveTransactions, saveUser, updateUser
} from './users.database';
import {
  comparePasswords, createLoginTokens, createToken, decodeToken, emailVerification, hashPassword,
  payloadLogin, payloadUserEmail, verifyToken
} from './users.authentication';
import { passwordRecoveryTokenExpires } from '../config';
import { passwordRecoveryMail } from '../mail/mail.controller';
import { userTypes } from '../database/models/user';
import { spamHandler } from '../mail/spam.service';
import { ErrorMessage, ManyTransactionModel, ReqQuery, RequestId, UserModel, MailInfo } from '../types/types';
import { Request, Response } from 'express';

// Error messages
const tokenCreateError: ErrorMessage = { status: 500, message: 'Whoops, couldn\'t create tokens' };
const tokenVerifyError: ErrorMessage = { status: 500, message: 'Whoops, token is not valid' };
const mailVerifyError: ErrorMessage = { status: 403, message: 'Your e-mail has not been verified, please check your inbox or spambox.' };
const findError: ErrorMessage = { status: 404, message: 'Document not found' };
const duplicateError: ErrorMessage = { status: 409, message: 'Username / Email already exists' };
const saveError: ErrorMessage = { status: 500, message: 'Could not save to the database' };
const loginError: ErrorMessage = { status: 404, message: 'Oh, ow.. Username or password is incorrect' };
const userFindError: ErrorMessage = { status: 404, message: 'User not found' };
const deleteError: ErrorMessage = { status: 500, message: 'Could not delete user from the database, please try again' };
const deleteErrorMany: ErrorMessage = { status: 500, message: 'Could not delete (some) user(s) from the database, please check again' };
const verifyError: ErrorMessage = {
  status: 403, message: 'Verification has expired, this means you\'re already verified or you waited too long...'
};
const mailError: ErrorMessage = { status: 503, message: 'Could not send mail...' };

// Success messages
const registrationSuccess = 'Whoopie, registration successful!';
const loginSuccess = 'Whoopie, login successful!';
const updateSuccess = 'Whoopie, update successful!';
const verifySuccess = 'E-mail verified!';
const verifyDone = 'E-mail already verified!';
const actionSuccess = 'Action successful';
const sendMailSuccess = 'Whoopie, mail send successfully!';

// ------------- functions --------------

// Check for duplicates
export async function checkDuplicate(req: Request | ReqQuery): Promise<boolean> {
  const { query } = req;
  let isDuplicate;

  const user = await findUser(query, { _id: 0, username: 1 });

  if (!user) { isDuplicate = false; }
  if (user) { isDuplicate = true; }

  return isDuplicate;
}

// Login
export async function logIn(req: Request, res: Response): Promise<string> {
  const loginForm = req.body;

  // Spam check
  if (loginForm.lname) {
    spamHandler('Login');

    return loginSuccess;
  }

  const user = await findUser({ email: loginForm.email }, { hash: 1, username: 1, type: 1 });
  if (!user) { return Promise.reject(loginError); }

  if (user.type.rank < 1) { return Promise.reject(mailVerifyError); }

  const password = await comparePasswords(loginForm.password, user.hash);
  if (!password) { return Promise.reject(loginError); }

  const payload = payloadLogin(user);
  const tokens = createLoginTokens(payload, user.hash);

  if (!tokens) { return Promise.reject(tokenCreateError); }

  res.set('x-token', tokens.token);
  res.set('x-refresh-token', tokens.refreshToken);

  return loginSuccess;
}

// Login check
export async function loginCheck(): Promise<string> {
  return loginSuccess;
}

// User password recovery
export async function passwordRecovery(req: RequestId | ReqQuery): Promise<string> {
  const query = { email: '', _id: '' };
  if (req.body.email) { query.email = req.body.email; }
  if (req.body.id) { query._id = req.body.id; }
  const { origin } = req.headers;

  const user = await findUser(query, { _id: 0 });

  if (!user) { return Promise.reject(userFindError); }

  const payload = payloadUserEmail(user);
  const verificationToken = createToken(payload, passwordRecoveryTokenExpires, user.hash);

  if (!verificationToken) { return Promise.reject(tokenCreateError); }

  await passwordRecoveryMail(user, origin as string, verificationToken);

  return sendMailSuccess;
}

// Update user
export async function userUpdate(req: RequestId): Promise<string> {
  const updateForm = req.body;
  const check = req;

  // tslint:disable-next-line no-dynamic-delete
  Object.keys(updateForm).forEach((key => (updateForm[key] === null || '') && delete updateForm[key]));
  const { userId } = req;

  const exists = [];
  if (updateForm.username) {
    check.query = { username: updateForm.username };
    exists.push(await checkDuplicate(check));
  }
  if (updateForm.email) {
    check.query = { username: updateForm.email };
    exists.push(await checkDuplicate(check));
  }

  if (exists.some(x => x !== null)) { return Promise.reject(duplicateError); }

  if (updateForm.username) { updateForm.usernameIndex = updateForm.username; }
  if (updateForm.password) { updateForm.hash = await hashPassword(updateForm.password); }

  // if (updateForm.email) updateForm.type = userTypes.tempUser; // TODO

  const result = await updateUser({ _id: userId }, updateForm);
  if (result.ok !== 1) { return Promise.reject(saveError); }

  return updateSuccess;
}

export async function updatePassword(req: RequestId): Promise<string> {
  if (!req.query.token) { return Promise.reject(verifyError); }
  const { token } = req.query;

  const decodedToken = decodeToken(token);
  if (!decodedToken) { Promise.reject(tokenVerifyError); }

  const user = await findUser({ email: decodedToken.user }, { hash: 1 });

  if (!user) { return Promise.reject(verifyError); }

  const verifiedToken = await verifyToken(token, user.hash);

  if (!verifiedToken) { return Promise.reject(verifyError); }

  req.userId = user.id; // Input for userUpdate function

  return userUpdate(req);
}

export async function userResetPasswordMany(req: RequestId): Promise<string> {

  const resetPasswordManyId: string = req.params.id;

  const transactionDocument = await findTransactions(resetPasswordManyId);
  if (!transactionDocument) { return Promise.reject(findError); }

  const transactions = transactionDocument.data;

  const result = await Promise.all(transactions.map(async id => {
    let error: MailInfo;
    const user: ReqQuery = { body: { id, headers: req.headers } };

    await passwordRecovery(user).catch(err => { error = err; });
    if (error) { return { id, success: false, message: error.response }; }

    return { id, success: true, message: 'Mail send successful' };
  }));

  const isError = result.some(x => x.success === false);
  const rejectError: ErrorMessage = { status: mailError.status, message: mailError.message, result };

  if (isError) { return Promise.reject(rejectError); }

  return actionSuccess;
}

// Delete user
export async function userDelete(req: RequestId): Promise<string> {
  const { userId } = req;

  const result = await deleteUser({ _id: userId });
  if (result.n === 0) { return Promise.reject(deleteError); }

  return actionSuccess;
}

export async function userMany(req: RequestId): Promise<ManyTransactionModel> {
  const transactions = req.body;

  const result = await saveTransactions(transactions);

  if (!result) { return Promise.reject(saveError); }

  return result;
}

export async function userDeleteMany(req: RequestId): Promise<string> {
  const deleteManyId = req.params.id;

  const transactionDocument = await findTransactions(deleteManyId);

  if (!transactionDocument) { return Promise.reject(findError); }

  const transactions = transactionDocument.data;

  const result = await deleteMany(transactions);

  if (result.ok !== 1) { return Promise.reject(deleteErrorMany); }

  return actionSuccess;
}

// Register user
export async function registerUser(req: RequestId): Promise<string> {
  const user = req.body;
  const { origin } = req.headers;

  // Spam check
  if (user.lname) {
    spamHandler('Registration');

    return registrationSuccess;
  }

  const exists = await Promise.all([
    checkDuplicate({ query: { username: user.username } }),
    checkDuplicate({ query: { email: user.email } })
  ]);

  if (exists.some(x => x === true)) { return Promise.reject(duplicateError); }

  user.hash = await hashPassword(user.password);
  user.type = userTypes.tempUser;

  const savedTempUser = await saveTempUser(user);
  if (!savedTempUser) { return Promise.reject(saveError); }

  await emailVerification(savedTempUser, origin as string).catch(error => {
    deleteTempUser({ _id: savedTempUser.id });

    return Promise.reject(error);
  });

  return registrationSuccess;
}

// Verify email
export async function verifyEmail(req: RequestId): Promise<string> {
  const { token } = req.query;

  const verifiedToken = await verifyToken(token);
  if (!verifiedToken) { return Promise.reject(verifyError); }

  const userTemp = await findUser({ email: verifiedToken.user }, { _id: 0 });
  if (!userTemp) { return Promise.reject(verifyError); }

  if (userTemp.type.rank >= userTypes.user.rank) { return verifyDone; }

  userTemp.type = userTypes.user;

  deleteTempUser({ email: userTemp.email });

  const user = await saveUser(userTemp);
  if (!user) { return Promise.reject(saveError); }

  return verifySuccess;
}

// User queries
export async function userInfo(req: RequestId): Promise<UserModel> {
  const { userId } = req;

  const user = await findUser({ _id: userId }, { _id: 0, hash: 0, usernameIndex: 0 });
  if (!user) { return Promise.reject(findError); }

  return user;
}

export async function userGetAll(): Promise<Array<UserModel>> {
  const users = await findAllUsers({ hash: 0 });

  if (users.length === 0) { return Promise.reject(findError); }

  return users;
}

// Mock user
export async function mockUser(req: RequestId): Promise<string> {
  const user = req.body;

  const exists = await Promise.all([
    checkDuplicate({ query: { username: user.username } }),
    checkDuplicate({ query: { email: user.email } })
  ]);

  if (exists.some(x => x === true)) { return Promise.reject(duplicateError); }

  user.usernameIndex = user.username;
  user.type = userTypes.user.value;
  user.hash = await hashPassword(user.password);

  const savedUser = await saveUser(user);

  if (!savedUser) { return Promise.reject(saveError); }

  return registrationSuccess;
}
