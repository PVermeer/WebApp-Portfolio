import { Request } from 'express';
import { UserType } from "../database/models/users/user.types";

export interface ErrorMessage {
  status: number;
  message: string;
  [key: string]: any;
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
