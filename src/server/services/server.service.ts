
interface Config {
  appName: string;
  mongoDb: string;
  secret1: string;
  secret2: string;
  loginTokenExpires: string;
  refreshTokenExpires: string;
  verificationTokenExpires: string;
  passwordRecoveryTokenExpires: string;
  emailTo: string;
  gmailConfig: {
    host: string;
    port: number;
    secure: boolean;
    auth: {
      user: string;
      pass: string;
    }
  };
}

let config: Config;
try {
  config = require('../../../config.json');
} catch {
  console.log('Config file missing');
  config = require('../../../config_dummy.json');
}
export { config };
