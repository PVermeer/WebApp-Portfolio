export class UserRegister {
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
}

export interface UserLogin {
  email: string;
  password: string;
}
export interface UserDocument {
  created_at: Date;
  email: string;
  firstName: string;
  lastName: string;
  type: string;
  updatedAt: Date;
  username: string;
}
