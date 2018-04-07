const nodeMailer = require('nodemailer');

const config = require('../config');
const { spamHandler } = require('./spam.service');

// Create the transporter object for nodeMailer
const transporter = nodeMailer.createTransport(config.gmailConfig);

// Reject error messages (status !200)
const sendError = 'Whoops, could not send the e-mail :(';
const sendContactError = `Whoops, could not send the e-mail :(. <br>
  You can reach me via:<br><br>
  <b>${config.emailTo}</b>`;

// Error messages (status 200)
const emptyError = { error: 'Oh, ow.. Some fields are empty' };
const spamError = { success: 'Thanks for sending me a message!' };

// Success messages
const sendFormSuccess = { success: 'Whoopie, form send successfully!' };


// ----------Functions------------
exports.contactForm = async (req) => {
  const formData = req.body;

  if (formData.lname) {
    spamHandler(transporter, 'contact form');
    return spamError;
  }

  delete formData.lname;

  const isEmpty = Object.values(formData).some(x => (x === null || x === ''));
  if (isEmpty) return emptyError;

  const formMail = {
    from: `"${config.appName}" <noreply@${config.appName}.com>`,
    to: config.emailTo,
    subject: `${config.appName} contact form: ${formData.subject}`,
    html: `<b> From: </b>${formData.name}<br>
            <b> E-mail: </b>${formData.email}<br>
            <b> Subject: </b>${formData.subject}<br><br>
            <b> Message: </b><br>${formData.message}`,
  };

  await transporter.sendMail(formMail).catch(() => Promise.reject(sendContactError));

  return sendFormSuccess;
};

exports.userVerificationMail = async (user, origin) => {
  if (!user) return sendError;

  const formMail = {
    from: `"${config.appName}" <noreply@${config.appName}.com>`,
    to: user.email,
    subject: `${config.appName}: Verifify your email`,
    html: `<h1>Verify your email address for registration on ${config.appName}</h1>
            <br><p>You can verify your email address by clicking on the following link:</p>
            <br><a href="${origin}/user/verifyuser?user=${user.verificationToken}">Click here to verify your email address</a>
            <br><p>Alternatively, you can copy the following link and paste it in your browser:</p>
            <br>${origin}/user/verifyuser?user=${user.verificationToken}`,
  };

  await transporter.sendMail(formMail).catch(() => Promise.reject(sendError));

  return sendFormSuccess;
};

exports.passwordRecoveryMail = async (user, origin) => {
  if (!user) return sendError;

  const formMail = {
    from: `"${config.appName}" <noreply@${config.appName}.com>`,
    to: user.email,
    subject: `${config.appName}: Password recovery`,
    html: `<h1>Verify your email address for password recovery on ${config.appName}</h1>
            <br><p>You can verify your email address by clicking on the following link:</p>
            <br><a href="${origin}/user/updateuser?user=${user.verificationToken}">Click here to reset your password</a>
            <br><p>Alternatively, you can copy the following link and paste it in your browser:</p>
            <br>${origin}/user/updateuser?user=${user.verificationToken}`,
  };

  await transporter.sendMail(formMail).catch(() => Promise.reject(sendError));

  return sendFormSuccess;
};

