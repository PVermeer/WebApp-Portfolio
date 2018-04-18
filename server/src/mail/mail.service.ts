import { appName, emailTo } from '../config';
import { ContactForm, Mail, UserModel } from '../types/types';

// ------------ Mail templates ----------------

export function contactTemplate(formData: ContactForm): Mail {
  const formMail = {
    from: `"${appName}" <noreply@${appName}.com>`,
    to: emailTo,
    subject: `${appName} contact form: ${formData.subject}`,
    html: `<b> From: </b>${formData.name}<br>
            <b> E-mail: </b>${formData.email}<br>
            <b> Subject: </b>${formData.subject}<br><br>
            <b> Message: </b><br>${formData.message}`
  };

  return formMail as Mail;
}

export function userVerificationTemplate(user: UserModel, origin: string, verificationToken: string): Mail {
  const formMail = {
    from: `"${appName}" <noreply@${appName}.com>`,
    to: user.email,
    subject: `${appName}: Verifify your email`,
    html: ` <h1>Hey ${user.firstName}!</h1>
            <h2>Verify your email address for registration on ${appName}</h2>
            <br><p>You can verify your email address by clicking on the following link:</p>
            <br><a href="${origin}/user/verifyuser?user=${verificationToken}">Click here to verify your email address</a>
            <br><p>Alternatively, you can copy the following link and paste it in your browser:</p>
            <br>${origin}/user/verifyuser?user=${verificationToken}`
  };

  return formMail as Mail;
}

export function passwordRecoveryTemplate(user: UserModel, origin: string, verificationToken: string): Mail {
  const formMail = {
    from: `"${appName}" <noreply@${appName}.com>`,
    to: user.email,
    subject: `${appName}: Password recovery`,
    html: ` <h1>Hey ${user.firstName}!</h1>
            <h2>Verify your email address for password recovery on ${appName}</h2>
            <br><p>There has been a password recovery request made. If this was not you you can ignore this message.</p>
            <br><p>You can verify your email address by clicking on the following link:</p>
            <br><a href="${origin}/user/updateuser?user=${verificationToken}">Click here to reset your password</a>
            <br><p>Alternatively, you can copy the following link and paste it in your browser:</p>
            <br>${origin}/user/updateuser?user=${verificationToken}`
  };

  return formMail as Mail;
}
