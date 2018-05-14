
export interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
  lname: string;
}

export interface MailError extends Error {
  code: string;
  command: string;
  response: string;
  responseCode: number;
}
