export class User {
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
}

export interface LoginForm {
  email: string;
  password: string;
}
