const nodeMailer = require('nodemailer');

const config = require('../config');

let timeoutFlag = false;

// Time-out function
function flagTimeOut() {
  let timeout;
  clearTimeout(timeout);
  timeoutFlag = true;
  timeout = setTimeout(() => {
    timeoutFlag = false;
  }, 1000 * 60 * 60);
}

exports.sendErrorMail = (error) => {
  if (timeoutFlag) return;
  flagTimeOut();

  const transporter = nodeMailer.createTransport(config.gmailConfig);
  const errorMail = {
    from: '"Portfolio WebApp" <noreply@portfolio.nl>',
    to: 'pimwebsites@gmail.com',
    subject: 'Portfolio ERROR',
    html: ` <b> Date: </b>${new Date()}<br>
          <b> Error: </b><br>${JSON.stringify(error, null, '\t')}`,
  };

  transporter.sendMail(errorMail);
};
