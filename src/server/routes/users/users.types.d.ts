import { Request } from 'express';
import { Query } from 'mongoose';
import { UpdateWriteOpResult } from 'mongodb';
import { UserType } from '../../database/models/users/user.types';

// Input

// ---------- Queries ------------
export interface QueryResult extends Query<UpdateWriteOpResult['result']> { }

// Password recovery
export interface PasswordRecovery {
  email?: string;
  _id?: string;
}

// Mail many response
export interface MailManyResponse {
  _id: string;
  success: boolean;
  message: string;
}

// -------------- Tokens ----------------
export interface LoginTokens {
  refreshToken: string;
  token: string;
  _id: string;
  type: UserType;
}

export interface Payload {
  _id?: string;
  type?: UserType;
  username?: string;
  email?: string;
  newEmail?: string;
}
export interface LoginPayload extends Payload {
  _id: string;
  type: UserType;
  username: string;
}
export interface VerificationPayload extends Payload {
  email: string;
}
export interface EmailUpdatePayload extends Payload {
  email: string;
  _id: string;
  newEmail: string;
}
