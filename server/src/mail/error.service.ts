import { appName, emailTo, gmailConfig } from '../config';
import { createTransport } from 'nodemailer';

// Create the transporter object for nodeMailer
const transporter = createTransport(gmailConfig);

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

export function sendErrorMail(error: Error): void {
  if (timeoutFlag) return;

  flagTimeOut();

  // tslint:disable: no-null-keyword
  const errorMail = {
    from: `"${appName}" <noreply@${appName}.com>`,
    to: emailTo,
    subject: `${appName}: Error`,
    html: ` <b> Date: </b>${new Date()}<br>\n<b> Error: </b><br>${JSON.stringify(error, null, '\t')}`
  };
  // tslint:enable: no-null-keyword

  transporter.sendMail(errorMail);
}
