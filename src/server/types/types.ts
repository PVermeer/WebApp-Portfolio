import { Request } from 'express';

export interface ErrorMessage {
  status: number;
  message: string;
  [key: string]: any;
}

export interface UserType {
  rank: number;
  value: string;
}

export interface UserModel {
  _id?: any;
  id?: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  usernameIndex?: string;
  email?: string;
  hash?: string;
  type?: UserType;
}

export interface UserQuery {
  _id?: any;
  username?: string;
  usernameIndex?: string;
  email?: string;
  type?: UserType;
}

export interface QueryResult {
  n: number;
  ok: 1 | 0;
  nModified?: 1;
}

export interface UserFetch {
  _id?: 1 | 0;
  id?: 1 | 0;
  firstName?: 1 | 0;
  lastName?: 1 | 0;
  username?: 1 | 0;
  usernameIndex?: 1 | 0;
  email?: 1 | 0;
  hash?: 1 | 0;
  type?: 1 | 0;
}

export interface ManyTransactionModel {
  _id: any;
  data?: Array<string>;
}

export interface Mail {
  from: string;
  to: string;
  subject: string;
  html: string;
}

export interface MailInfo {
  messageId?: any;
  envelope?: any;
  accepted?: any;
  rejected?: any;
  pending?: any;
  response?: any;
}

export interface Payload {
  user: string;
  username?: string;
  type?: UserType;
}

export interface NewTokens {
  token: string;
  refreshToken: string;
  userId: string;
  type: UserType;
}

export interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface RequestId extends Request {
  userId?: string;
  type?: UserType;
}

export interface ReqQuery {
  query?: any;
  body?: any;
  headers?: any;
}
