import { createTransport } from 'nodemailer';
import { NextFunction, Request, Response } from 'express';

import { emailTo, gmailConfig } from '../config';
import { spamHandler } from './spam.service';
import { contactTemplate, passwordRecoveryTemplate, userVerificationTemplate } from './mail.service';
import { ErrorMessage, UserModel } from '../types/types';

// Create the transporter object for nodeMailer
const transporter = createTransport(gmailConfig);

// Error messages
const emptyError: ErrorMessage = { status: 400, message: 'Some fields are empty' };
const sendContactError: ErrorMessage = {
  status: 503,
  message: `Whoops, could not send the e-mail :(. <br>
  You can reach me via:<br><br>
  <b>${emailTo}</b>`
};

// Success messages
const spamError = 'Thanks for sending me a message!';
const sendMailSuccess = 'Whoopie, mail send successfully!';

// ------------ Functions --------------

export async function contactForm(req: Request, res: Response, next: NextFunction): Promise<void | Response> {

  const formData = req.body;

  if (formData.lname) {
    spamHandler('contact form');

    return res.json(spamError);
  }
  delete formData.lname;

  const isEmpty = Object.values(formData).some(x => (x === null || x === ''));
  if (isEmpty) { return next(emptyError); }

  const formMail = contactTemplate(formData);

  return transporter.sendMail(formMail).then(() => res.json(sendMailSuccess))
    .catch(() => next(sendContactError));
}

export async function userVerificationMail(user: UserModel, origin: string, verificationToken: string): Promise<void> {

  const formMail = userVerificationTemplate(user, origin, verificationToken);

  return transporter.sendMail(formMail, (error, info) => {
    if (error) { return error; }
    return info;
  });
}

export async function passwordRecoveryMail(user: UserModel, origin: string, verificationToken: string): Promise<void> {

  const formMail = passwordRecoveryTemplate(user, origin, verificationToken);

  return transporter.sendMail(formMail, (error, info) => {
    if (error) { return error; }
    return info;
  });
}
