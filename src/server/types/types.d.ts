import { Request } from 'express';
import { UserType } from "../database/models/users/user.types";

export interface ErrorMessage {
  status: number;
  message: string;
  [key: string]: any;
}

/**
 * @property maxDiskCache: in Ms
 */
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
  tempDir: string;
  cacheDir: string;
  cacheDirFiles: string;
  cacheDirJson: string;
  uploadDir: string;
  logDir: string;
  maxDiskCache: number;
}

// --------- Express request extender --------
export interface RequestId extends Request {
  _id?: string;
  type?: UserType;
}

export interface ReqQuery {
  query?: any;
  body?: any;
  headers?: any;
}
