import { Options as MailOptions } from 'nodemailer/lib/mailer';

import { config } from '../../services/server.service';
import { ContactForm } from './mail.types';
import { UserDocumentLean } from '../../database/models/users/user.types';

// ------------ Mail templates ----------------

export function contactTemplate(formData: ContactForm): MailOptions {
  const formMail: MailOptions = {
    from: `"${config.appName}" <noreply@${config.appName}.com>`,
    to: config.emailTo,
    subject: `${config.appName} contact form: ${formData.subject}`,
    html: `<b> From: </b>${formData.name}<br>
            <b> E-mail: </b>${formData.email}<br>
            <b> Subject: </b>${formData.subject}<br><br>
            <b> Message: </b><br>${formData.message}`
  };

  return formMail;
}

export function userVerificationTemplate(user: UserDocumentLean, origin: string, verificationToken: string): MailOptions {
  const formMail: MailOptions = {
    from: `"${config.appName}" <noreply@${config.appName}.com>`,
    to: user.email,
    subject: `${config.appName}: Verifify your email`,
    html: ` <h1>Hey ${user.firstName}!</h1>
            <h2>Verify your email address for registration on ${config.appName}</h2>
            <br><p>You can verify your email address by clicking on the following link:</p>
            <br><a href="${origin}/user/verifyuser?user=${verificationToken}">Click here to verify your email address</a>
            <br><p>Alternatively, you can copy the following link and paste it in your browser:</p>
            <br>${origin}/user/verifyuser?user=${verificationToken}`
  };

  return formMail;
}

export function passwordRecoveryTemplate(user: UserDocumentLean, origin: string, verificationToken: string) {
  const formMail = {
    from: `"${config.appName}" <noreply@${config.appName}.com>`,
    to: user.email,
    subject: `${config.appName}: Password recovery`,
    html: ` <h1>Hey ${user.firstName}!</h1>
            <h2>Verify your email address for password recovery on ${config.appName}</h2>
            <br><p>There has been a password recovery request made. If this was not you you can ignore this message.</p>
            <br><p>You can verify your email address by clicking on the following link:</p>
            <br><a href="${origin}/user/updateuser?user=${verificationToken}">Click here to reset your password</a>
            <br><p>Alternatively, you can copy the following link and paste it in your browser:</p>
            <br>${origin}/user/updateuser?user=${verificationToken}`,
  };

  return formMail;
}

export function userEmailUpdateTemplate(user: UserDocumentLean, origin: string, verificationToken: string): MailOptions {
  const formMail: MailOptions = {
    from: `"${config.appName}" <noreply@${config.appName}.com>`,
    to: user.email,
    subject: `${config.appName}: Verifify your email`,
    html: ` <h1>Hey ${user.firstName}!</h1>
            <h2>Verify your email address to update on ${config.appName}</h2>
            <br><p>You can verify your email address by clicking on the following link:</p>
            <br><a href="${origin}/user/verifyEmail?user=${verificationToken}">Click here to verify your email address</a>
            <br><p>Alternatively, you can copy the following link and paste it in your browser:</p>
            <br>${origin}/user/verifyEmail?user=${verificationToken}`
  };

  return formMail;
}
