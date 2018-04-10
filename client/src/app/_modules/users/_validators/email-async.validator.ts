import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';

export interface EmailAsyncValidatorOptions {
  debounceTime: number;
  service: any;
}

/**
 * Takes 2 arguments: debounceTime, service.
 * - Debounce time in ms.
 * - Service to be used to connect to external.
 * E.g. emailAsyncValidator({debounceTime: 500, service: this.userService})
 * Use in the Angular reactive forms aSync validator array (third in array).
*/
export function emailAsyncValidator(options: EmailAsyncValidatorOptions) {

  const validator = new EmailAsyncValidator(options);

  return function validateEmail(control: FormControl) {
    return validator.emailValidator(control.value);
  };

}

export class EmailAsyncValidator {

  constructor(
    private options: EmailAsyncValidatorOptions,
  ) { }

  emailValidator(value) {
    if (!value) {
      return Promise.resolve(null);
    }
    return Observable.timer(this.options.debounceTime).switchMap(() => {
      const input = value.toLowerCase().trim();
      return this.options.service.checkEmail(input);
    });
  }
}
