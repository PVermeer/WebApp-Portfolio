import { decode, sign, verify } from 'jsonwebtoken';
import { compare, hash } from 'bcryptjs';
import { findUser } from './users.database';
import {
  loginTokenExpires, refreshTokenExpires, secret, secret2, verificationTokenExpires
} from '../config';
import { userVerificationMail } from '../mail/mail.controller';
import { ErrorMessage, NewTokens, Payload, RequestId, UserModel, UserType } from '../types/types';
import { NextFunction, Response } from 'express';

// Passwords

/**
 *  Hash + salt password.
 * @param password Password.
 * @returns Hashed password.
 */
export const hashPassword = (password: string): Promise<string> => new Promise((resolve, reject) => {
  hash(password, 10, (error, result) => {
    if (error) reject(error);
    resolve(result);
  });
});

/**
 * Compare passwords.
 * @param password Password.
 * @param hashPassword Hashed password.
 */
export const comparePasswords = (password: string, hashedPassword: string): Promise<boolean> => new Promise((resolve, reject) => {
  compare(password, hashedPassword, (error, result) => {
    if (error) reject(error);
    resolve(result);
  });
});

// ------------Tokens-------------------------

/**
 * Create a login payload.
 * @param user User document.
 * @returns Payload object.
 */
export function payloadLogin(user: UserModel): Payload {
  const payload: Payload = { user: user.id, username: user.username, type: user.type };

  return payload;
}

/**
 * Create an email payload.
 * @param user User email document.
 * @returns Payload object.
 */
export function payloadUserEmail(user: UserModel): Payload {
  const payload: Payload = { user: user.email };

  return payload;
}

/**
 * Create a new JWT.
 * @param payload Included data.
 * @param expires 10m, 1d, ...
 * @param dbEntry (Optional) Added to the secret.
 * @returns Token.
 */
export function createToken(payload: Payload, expires: string, dbEntry?: string | number): string {
  let useSecret = secret;
  if (dbEntry) useSecret = secret2 + dbEntry;

  const token = sign(payload, useSecret, { expiresIn: expires });

  return token;
}

/**
 * Creates two login-JWT's.
 * @param payload Included data.
 * @param hashPassword Added to the secret of the refreshtoken.
 * @returns Object with two tokens.
 */
export function createLoginTokens(payload: Payload, hashedPassword: string): { token: string; refreshToken: string; } {

  const token = createToken(payload, loginTokenExpires);
  const refreshToken = createToken(payload, refreshTokenExpires, hashedPassword);

  const tokens = { token, refreshToken };

  return tokens;
}

/**
 * Verify a JWT.
 * @param token Token.
 * @param dbEntry (Optional) Added to the secret.
 * @returns Payload as object or false if token is invalid.
 */
export async function verifyToken(token: string, dbEntry?: string | number): Promise<false | Payload> {
  let useSecret = secret;
  if (dbEntry) useSecret = secret2 + dbEntry;

  let result: Payload | false;
  await verify(token, useSecret, (error, payload) => {
    if (error) result = false;
    result = payload as Payload;
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
export async function refreshTokens(refreshToken: string): Promise<NewTokens | false> {

  const decoded = decodeToken(refreshToken);

  const user: UserModel = await findUser({ _id: decoded.user }, { username: 1, hash: 1, type: 1 });
  if (!user) return false;

  const verifiedRefreshToken = await verifyToken(refreshToken, user.hash);
  if (!verifiedRefreshToken) return false;

  const payload = payloadLogin(user);
  const tokens = createLoginTokens(payload, user.hash);

  if (!tokens.token || !tokens.refreshToken) return Promise.reject(false);

  const newTokens: NewTokens = {
    token: tokens.token,
    refreshToken: tokens.refreshToken,
    userId: user.id,
    type: user.type
  };

  return newTokens;
}

// -------------- Email verification ------------------

/**
 * Send email verification mail.
 * @param user User object.
 * @param origin Origin url.
 * @returns True if successful.
 */
export async function emailVerification(user: UserModel, origin: string): Promise<true> {

  const payload = payloadUserEmail(user);
  const verificationToken = createToken(payload, verificationTokenExpires);

  await userVerificationMail(user, origin, verificationToken)
    .catch(error => Promise.reject(error));

  return true;
}

// ------------Authentication middleware----------------

/**
 * User authentication as middleware
 * @param status Status code to return if tokens are not valid.
 * @returns Calls next() or responds with the provided status.
 */
export const requiresUserAuth = (status: number, type: UserType) => async (req: RequestId, res: Response, next: NextFunction) => {

  let error;
  const authError: ErrorMessage = { status, message: 'Not logged in' };
  const typeError: ErrorMessage = { status, message: 'You\'re not authorized!' };
  const sessionError: ErrorMessage = { status, message: 'User session expired' };

  const token = req.headers['x-token'] as string;
  if (!token) return next(authError);

  const verifiedToken = await verifyToken(token)
    .catch((err: Error) => { error = err; });
  if (error) return next(error);

  if (verifiedToken) {
    if (verifiedToken.type.rank < type.rank) return next(typeError);
    req.userId = verifiedToken.user;
    req.type = verifiedToken.type;

    return next();
  }

  const refreshToken = req.headers['x-refresh-token'] as string;
  if (!refreshToken) return next(authError);

  const newTokens = await refreshTokens(refreshToken)
    .catch(err => { error = err; });
  if (error) return next(error);

  if (!newTokens) return next(sessionError);

  req.userId = newTokens.userId;
  req.type = newTokens.type;
  res.set('x-token', newTokens.token);
  res.set('x-refresh-token', newTokens.refreshToken);

  return next();
};
