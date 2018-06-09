import { NextFunction, Request, Response } from 'express';
import { createTransport } from 'nodemailer';
import { dbReadOnlyError } from '../database/connection';
import { ErrorMessage } from '../types/types';
import { config } from './server.service';

export function errorHandler(err: ErrorMessage | Error, _req?: Request, res?: Response, _next?: NextFunction) {

  if (!config.productionEnv) { console.error(err); }
  if (dbReadOnlyError()) { res.status(503).send({ message: 'Database is set to read only' }); return; }

  if (err instanceof Error) {
    const error = err as Error;

    if (config.productionEnv) {
      sendErrorMail(error);
      if (res) { res.status(500).send({ message: error.message }); }

    } else {
      if (res) { res.status(500).send(error); }
    }

    return;
  } else {

    const errorMessage = err as ErrorMessage;
    if (config.productionEnv) { sendErrorMail(errorMessage); }

    if (errorMessage.code === 'LIMIT_FILE_SIZE') {
      if (res) { res.status(400).send({ message: errorMessage.message }); }
      return;
    }

    if (res) { res.status(errorMessage.status).send({ message: errorMessage.message }); }

    return;
  }
}

// Error messages
export const saveError: ErrorMessage = { status: 500, message: 'Could not save document to the database' };
export const deleteError: ErrorMessage = { status: 500, message: 'Could not delete document from the database, please try again' };
export const updateError: ErrorMessage = { status: 500, message: 'Could not update user from the database, please try again' };
export const updateErrorDetected: ErrorMessage = { status: 500, message: 'Some errors were detected, please check content and try again' };
export const blockedError: ErrorMessage = { status: 401, message: `You are blocked from ${config.appName}` };
export const mailVerifyError: ErrorMessage = {
  status: 403, message: 'Your e-mail has not been verified, please check your inbox or spambox.'
};
export const verifyError: ErrorMessage = {
  status: 403, message: 'Verification has expired, this means you\'re already verified or you waited too long...'
};
export const findError: ErrorMessage = { status: 404, message: 'Document not found' };
export const loginError: ErrorMessage = { status: 404, message: 'Oh, ow.. Username or password is incorrect' };
export const duplicateError: ErrorMessage = { status: 409, message: 'Username / Email already exists' };
export const passwordLengthError: ErrorMessage = { status: 409, message: 'Password is too long, max: 59' };

// Success messages
export const registrationSuccess = 'Check your e-mail for the validation mail to verify your email';
export const loginSuccess = 'Whoopie, login successful!';
export const updateSuccess = 'Whoopie, update successful!';
export const verifySuccess = 'E-mail verified!';
export const verifyDone = 'E-mail already verified!';
export const actionSuccess = 'Action successful';
export const deleteSuccess = 'Document has been deleted';
export const accountDeleteSuccess = 'Your account has been deleted';
export const sendMailSuccess = 'Whoopie, mail send successfully!';
export const pageUpdateSuccess = 'Whoopie, page updated successfully!';
export const pageSaveSuccess = 'Whoopie, page created successfully!';

// ----------- Error mail ------------

let timeoutFlag = false;

// Time-out function
function flagTimeOut(): void {
  let timeout;
  clearTimeout(timeout);
  timeoutFlag = true;
  timeout = setTimeout(() => {
    timeoutFlag = false;
  }, 1000 * 60 * 60);
}
export function sendErrorMail(err: Error | ErrorMessage) {

  if (timeoutFlag) { return; }
  const transporter = createTransport(config.gmailConfig);

  let error = { message: '', stack: '' };
  if (err instanceof Error) {
    error = { message: err.message, stack: err.stack };
  } else {
    error = { message: err.message, stack: 'Custom error, no stack information generated' };
  }

  flagTimeOut();

  const errorMail = {
    from: `"${config.appName}" <noreply@${config.appName}.com>`,
    to: config.emailTo,
    subject: `${config.appName}: Error`,
    html: ` <b> Date: </b>${new Date()}<br>
    <b>Message: </b><br> ${error.message}<br>
    <b>Stack: </b><br>${error.stack}`
  };

  transporter.sendMail(errorMail);
}
