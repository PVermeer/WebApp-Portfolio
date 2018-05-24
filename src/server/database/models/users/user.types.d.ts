import { Document } from 'mongoose';


export interface UserType {
  readonly rank: number;
  readonly value: string;
}
export interface UserTypes {
  readonly blockedUser: UserType;
  readonly notLoggedIn: UserType,
  readonly tempUser: UserType;
  readonly user: UserType;
  readonly admin: UserType;
  readonly superAdmin: UserType;
  readonly developer: UserType;
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
