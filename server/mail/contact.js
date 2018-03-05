const nodeMailer = require('nodemailer');
const fs = require('fs');

const config = require('../config');

// Create the transporter object for nodeMailer
const transporter = nodeMailer.createTransport(config.gmailConfig);

// Variables
let spamFlag = false;
let spamCount = 0;
let logCount = 0;
const maxSpamCount = 10; // Before sending a report
const maxLogCount = 100; // Before deleting
const spamLog = './server/mail/logs/spam-mail.log';
const spamLogOld = './server/mail/logs/spam-mail_old.log';

const spamMail = {
  from: '"Portfolio WebApp" <noreply@portfolio.nl>',
  to: 'pimwebsites@gmail.com',
  subject: 'Portfolio: Spam report',
  html: `Spam counter has reached more than ${maxSpamCount} hits`,
};

// Anti-spam functions
function flagTimeOut() {
  let timeout;
  clearTimeout(timeout);
  spamFlag = true;
  timeout = setTimeout(() => {
    spamFlag = false;
  }, 1000 * 60 * 60);
}

function spamCounter() {
  // Spam counters
  spamCount += 1;
  logCount += 1;

  // Send conditional status mail
  if (spamCount > maxSpamCount && !spamFlag) {
    transporter.sendMail(spamMail);
    spamCount = 0;
    flagTimeOut();
  }

  // Logging spam in logfile
  new Promise((resolve, reject) => {
    fs.appendFile(spamLog, `Spam attempt: ${new Date()}\n`, (error) => {
      if (error) { reject(error); }
      resolve();
    });
  })
    .then(() => {
      if (logCount > maxLogCount) {
        new Promise((resolve, reject) => {
          fs.copyFile(spamLog, spamLogOld, (error) => {
            if (error) { reject(error); }
            resolve();
          });
        })
          .then(() => new Promise((resolve, reject) => {
            fs.unlink(spamLog, (error) => {
              if (error) { reject(error); }
              logCount = 0;
              resolve();
            });
          }));
      }
    });
}

// Handeling the contact form
exports.contactForm = req => new Promise((resolve) => {
  const formData = req.body;
  const formMail = {
    from: '"Portfolio WebApp" <noreply@portfolio.nl>',
    to: 'pimwebsites@gmail.com',
    subject: `Portfolio contact form: ${formData.subject}`,
    html: `<b> From: </b>${formData.name}<br>
            <b> E-mail: </b>${formData.email}<br>
            <b> Subject: </b>${formData.subject}<br><br>
            <b> Message: </b><br>${formData.message}`,
  };

  // Everything filled out?
  if (!formData.name ||
    !formData.email ||
    !formData.subject ||
    !formData.message) {
    formData.status = 'failure';
    resolve(formData);
  } else {
    // Spam check with hidden field
    if (formData.lname) {
      spamCounter();
      formData.status = 'succes';
      resolve(formData);
      return;
    }
    // Send the form
    transporter.sendMail(formMail, (error) => {
      if (error) {
        formData.status = 'failure';
        resolve(formData);
      } else {
        formData.status = 'succes';
        resolve(formData);
      }
    });
  }
});
