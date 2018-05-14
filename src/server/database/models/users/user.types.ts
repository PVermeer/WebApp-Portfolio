import { Document } from 'mongoose';


export interface UserType {
  rank: number;
  value: string;
}
export interface UserTypes {
  blockedUser: UserType;
  tempUser: UserType;
  user: UserType;
  admin: UserType;
  superAdmin: UserType;
}

// Input
export interface UserLogin {
  email: string;
  password: string;
  lname: String;
}
export interface UserRegister extends UserLogin {
  firstName: string;
  lastName: string;
  username: string;
}
export interface UserModel extends UserRegister {
  type: UserType;
}
export type UserUpdate = { [P in keyof UserModel]?: UserModel[P] };

// Output
export interface UserDocument extends UserModel, Document { _id: string; usernameIndex: string; }
export interface UserDocumentLean extends UserModel { _id: string; usernameIndex: string; }

export type UserQuery = { [P in keyof UserDocumentLean]?: UserDocumentLean[P] };
export type UserFetch = { [K in keyof UserDocumentLean]?: 1 | 0 };
