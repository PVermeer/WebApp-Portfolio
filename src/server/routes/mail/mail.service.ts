import { Request } from 'express';

import { ContactForm } from './mail.types';
import { config } from '../../services/server.service';
import { spamHandler } from './spam.service';
import { contactTemplate, passwordRecoveryTemplate, userVerificationTemplate, userEmailUpdateTemplate } from './mail.template';
import { ErrorMessage } from '../../types/types';
import { createTransport } from 'nodemailer';
import { UserDocumentLean } from '../../database/models/users/user.types';

// Create the transporter for nodeMailer
const transporter = createTransport(config.gmailConfig);

// Error messages
const emptyError: ErrorMessage = { status: 400, message: 'Some fields are empty' };

// Success messages
const spamError = 'Thanks for sending me a message!';
const sendMailSuccess = 'Whoopie, mail send successfully!';

// ------------ Functions --------------

export async function contactForm(req: Request): Promise<string> {

  const sendContactError: ErrorMessage = {
    status: 503,
    message: `Whoops, could not send the e-mail :(. <br>
    You can reach me via:<br><br>
    <b>${config.emailTo}</b>`
  };

  const formData: ContactForm = req.body;

  if (formData.lname) { spamHandler('contact form'); return spamError; }
  delete formData.lname;

  const isEmpty = Object.values(formData).some(x => (x === null || x === ''));
  if (isEmpty) { throw emptyError; }

  const mail = contactTemplate(formData);

  return transporter.sendMail(mail).then(() => sendMailSuccess)
    .catch(() => { throw sendContactError; });
}

export async function userVerificationMail(user: UserDocumentLean, origin: string, verificationToken: string): Promise<string> {

  const mail = userVerificationTemplate(user, origin, verificationToken);

  return transporter.sendMail(mail).then(() => sendMailSuccess);
}

export async function passwordRecoveryMail(
  user: UserDocumentLean, origin: string, verificationToken: string): Promise<string> {

  const mail = passwordRecoveryTemplate(user, origin, verificationToken);

  return transporter.sendMail(mail).then(() => sendMailSuccess);
}

export async function userEmailUpdateMail(user: UserDocumentLean, origin: string, verificationToken: string): Promise<string> {

  const mail = userEmailUpdateTemplate(user, origin, verificationToken);

  return transporter.sendMail(mail).then(() => sendMailSuccess);
}
