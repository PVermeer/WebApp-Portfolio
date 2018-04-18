import { createTransport } from 'nodemailer';
import { appendFile, copyFile, existsSync, mkdir, unlink } from 'fs';

import { sendErrorMail } from './error.service';
import { appName, emailTo, gmailConfig } from '../config';

// Create the transporter object for nodeMailer
const transporter = createTransport(gmailConfig);

// Variables
let spamFlag = false;
let spamCount = 0;
let logCount = 0;
const maxSpamCount = 10; // Before sending a report
const maxLogCount = 100; // Before deleting
const spamLog = './server/dist/mail/logs/spam-mail.log';
const spamLogOld = './server/dist/mail/logs/spam-mail_old.log';
const spamLogDir = './server/dist/mail/logs';

// Report time-out
function flagTimeOut(): void {
  let timeout;
  clearTimeout(timeout);
  spamFlag = true;
  timeout = setTimeout(() => {
    spamFlag = false;
  }, 1000 * 60 * 60);
}

// Handler
export async function spamHandler(origin: string): Promise<void> {
  const spamMail = {
    from: `"${appName}" <noreply@${appName}.nl>`,
    to: emailTo,
    subject: `${appName}: Spam report`,
    html: `Spam counter has reached more than ${maxSpamCount} hits. Origin: ${origin}`
  };

  spamCount += 1;
  logCount += 1;

  // Send conditional status mail
  if (spamCount > maxSpamCount && !spamFlag) {
    transporter.sendMail(spamMail);
    spamCount = 0;
    flagTimeOut();
  }

  // Logging spam in logfile
  if (!existsSync(spamLogDir)) {
    await mkdir(spamLogDir, (error: Error) => {
      if (error) { sendErrorMail(error); }
    });
  }

  await appendFile(spamLog, `Spam attempt from ${origin} : ${new Date()}\n`, (error: Error) => {
    if (error) { sendErrorMail(error); }
  });

  // Handling files
  if (logCount < maxLogCount) { return; }

  await copyFile(spamLog, spamLogOld, (error: Error) => {
    if (error) { sendErrorMail(error); }
  });

  await unlink(spamLog, (error: Error) => {
    if (error) { sendErrorMail(error); }
  });

  logCount = 0;
}
