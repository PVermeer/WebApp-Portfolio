const { sendErrorMail } = require('./error');

const fs = require('fs');
const config = require('../config.json');

// Variables
let spamFlag = false;
let spamCount = 0;
let logCount = 0;
const maxSpamCount = 10; // Before sending a report
const maxLogCount = 100; // Before deleting
const spamLog = './server/mail/logs/spam-mail.log';
const spamLogOld = './server/mail/logs/spam-mail_old.log';
const spamLogDir = './server/mail/logs';

// Report time-out
function flagTimeOut() {
  let timeout;
  clearTimeout(timeout);
  spamFlag = true;
  timeout = setTimeout(() => {
    spamFlag = false;
  }, 1000 * 60 * 60);
}

// Handler
exports.spamHandler = async (transporter, origin) => {
  const spamMail = {
    from: `"${config.appName}" <noreply@${config.appName}.nl>`,
    to: config.emailTo,
    subject: `${config.appName}: Spam report`,
    html: `Spam counter has reached more than ${maxSpamCount} hits. Origin: ${origin}`,
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
  if (!fs.existsSync(spamLogDir)) {
    await fs.mkdir(spamLogDir, (error) => {
      if (error) sendErrorMail(error);
    });
  }

  await fs.appendFile(spamLog, `Spam attempt from ${origin} : ${new Date()}\n`, (error) => {
    if (error) sendErrorMail(error);
  });

  // Handling files
  if (logCount < maxLogCount) return;

  await fs.copyFile(spamLog, spamLogOld, (error) => {
    if (error) sendErrorMail(error);
  });

  await fs.unlink(spamLog, (error) => {
    if (error) sendErrorMail(error);
  });

  logCount = 0;
};
