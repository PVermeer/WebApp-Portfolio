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
