import { FormControl } from '@angular/forms';

// tslint:disable-next-line:max-line-length
const EMAIL_REGEXP = /^(?=.{1,254}$)(?=.{1,64}@)[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+(\.[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+)*@[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?(\.[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*$/;

export function emailValidator() {

  const validator = new EmailValidator();

  return function validateEmail(control: FormControl) {
    return validator.emailValidator(control.value);
  };

}

export class EmailValidator {

  emailValidator(value) {
    if (!value) {
      return null;
    }
    return EMAIL_REGEXP.test(value) ? null : { 'email': true };
    }
  }
