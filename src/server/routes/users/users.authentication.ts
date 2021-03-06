import { compare } from 'bcryptjs';
import { NextFunction, Response } from 'express';
import { decode, sign, verify } from 'jsonwebtoken';
import { UserDocumentLean, UserType } from '../../database/models/users/user.types';
import { config } from '../../services/server.service';
import { ErrorMessage, RequestId } from '../../types/types';
import { findUserLean } from './users.database';
import { EmailUpdatePayload, LoginPayload, LoginTokens, Payload, VerificationPayload } from './users.types';

// --------- Passwords -------------

/**
 * Compare passwords.
 * @param password Password.
 * @param hashPassword Hashed password.
 */
export async function comparePasswords(password: string, hashedPassword: string): Promise<boolean> {

  return compare(password, hashedPassword).then(result => result);
}

// ------------Tokens-------------------------

/**
 * Create a login payload.
 * @param user User document.
 * @returns Payload object.
 */
function payloadLogin(user: Partial<UserDocumentLean>): LoginPayload {
  const payload = { _id: user._id, username: user.username, type: user.type };

  return payload;
}

/**
 * Create an email payload.
 * @param user User email document.
 * @returns Payload object.
 */
function payloadVerification(user: UserDocumentLean): VerificationPayload {

  const payload = { email: user.email };
  return payload;
}

function payloadEmailUpdate(user: UserDocumentLean, newEmail: string): EmailUpdatePayload {

  const payload = { _id: user._id, email: user.email, newEmail };
  return payload;
}

/**
 * Create a new JWT.
 * @param payload Included data.
 * @returns Token.
 */
function createToken(payload: Payload, secret: string, expires: string): string {

  const token = sign(payload, secret, { expiresIn: expires });

  return token;
}

/**
 * Creates two login-JWT's.
 * @param user user object.
 * @returns Object with two tokens.
 */
export function createLoginTokens(user: Partial<UserDocumentLean>): LoginTokens {

  const refreshSecret = config.secret2 + user.password;
  const payload = payloadLogin(user);

  const token = createToken(payload, config.secret1, config.loginTokenExpires);
  const refreshToken = createToken(payload, refreshSecret, config.refreshTokenExpires);

  const tokens: LoginTokens = {
    token,
    refreshToken,
    _id: user._id,
    type: user.type
  };

  return tokens;
}

/**
 * Creates a verification JWT.
 * @param user user object.
 * @returns Token.
 */
export function createVerificationToken(user: UserDocumentLean): string {

  const payload = payloadVerification(user);

  const token = createToken(payload, config.secret1, config.verificationTokenExpires);

  return token;
}

export function createEmailUpdateToken(user: UserDocumentLean, newEmail: string): string {

  const secret = config.secret2 + user.email;
  const payload = payloadEmailUpdate(user, newEmail);

  const token = createToken(payload, secret, config.verificationTokenExpires);

  return token;
}

/**
 * Verify a JWT.
 * @param token Token.
 * @returns Payload as object or false if token is invalid.
 */
export async function verifyToken(token: string): Promise<false | Payload> {

  let result: Payload | false;
  const secret: string = config.secret1;

  await verify(token, secret, (error, payload: Payload) => {
    if (error) { return result = false; }
    return result = payload;
  });

  return result;
}

/**
 * Verify a refresh JWT.
 * @param token Token.
 * @param user User lean object with password
 * @returns Payload as object or false if token is invalid.
 */
export async function verifyRefreshToken(token: string, user: Partial<UserDocumentLean>): Promise<false | Payload> {

  let result: Payload | false;
  const refreshSecret = config.secret2 + user.password;

  await verify(token, refreshSecret, (error, payload: Payload) => {
    if (error) { return result = false; }
    return result = payload;
  });

  return result;
}

/**
 * Verify the email update JWT.
 * @param token Token.
 * @param user User lean object with email.
 * @returns Payload as object or false if token is invalid.
 */
export async function verifyEmailUpdateToken(token: string, user: Partial<UserDocumentLean>): Promise<false | Payload> {

  let result: Payload | false;
  const refreshSecret = config.secret2 + user.email;

  await verify(token, refreshSecret, (error, payload: Payload) => {
    if (error) { return result = false; }
    return result = payload;
  });

  return result;
}

/**
 * Decodes a JWT. (Does not verify the token!)
 * @param token Token.
 * @returns Payload.
 */
export function decodeToken(token: string): Payload {
  return decode(token) as Payload;
}

/**
 * Refresh JWT's with the refresh token.
 * @param refreshToken Refresh token.
 * @returns Object with two new tokens or false if token is invalid.
 */
async function refreshLoginTokens(refreshToken: string): Promise<LoginTokens | false> {

  const decoded = decodeToken(refreshToken);

  const user = await findUserLean({ _id: decoded._id }, { username: 1, password: 1, type: 1 });

  const verifiedRefreshToken = await verifyRefreshToken(refreshToken, user);
  if (!verifiedRefreshToken) { return false; }

  const tokens = createLoginTokens(user);

  return tokens;
}

/**
 * Check current login status. Setting response token headers if necessary and adds _id and type to the req object.
 * @param status Status code to return if tokens are not valid.
 * @param userType The minimum userType rank to validate access.
 * @returns Responds with an ErrorMessage or null if login is valid.
 */
export async function checkLogin(req: RequestId, res: Response, status: number, type: UserType): Promise<ErrorMessage | null> {
  const authError: ErrorMessage = { status, message: 'Not logged in' };
  const typeError: ErrorMessage = { status, message: 'You\'re not authorized!' };
  const sessionError: ErrorMessage = { status, message: 'User session expired' };

  const token = req.headers['x-token'] as string;
  if (!token) { return authError; }

  const verifiedToken = await verifyToken(token);

  if (verifiedToken) {
    if (verifiedToken.type.rank < type.rank) { return typeError; }

    req._id = verifiedToken._id;
    req.type = verifiedToken.type;

    return null;
  }

  const refreshToken = req.headers['x-refresh-token'] as string;
  if (!refreshToken) { return authError; }

  const newTokens = await refreshLoginTokens(refreshToken);
  if (!newTokens) { return sessionError; }

  req._id = newTokens._id;
  req.type = newTokens.type;
  res.set('x-token', newTokens.token);
  res.set('x-refresh-token', newTokens.refreshToken);

  return null;
}

// ------------Authentication middleware----------------

/**
 * User authentication as middleware
 * @param status Status code in ErrorMessage to return if tokens are not valid.
 * @param userType The minimum userType rank to validate access.
 * @returns Calls next() or responds with the provided status.
 */
export const requiresUserAuth = (status: number, type: UserType) => async (req: RequestId, res: Response, next: NextFunction) => {

  const logInError = await checkLogin(req, res, status, type);

  if (logInError) { return next(logInError); }

  return next();
};
