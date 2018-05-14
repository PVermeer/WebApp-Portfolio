import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { ErrorMessage } from '../../../../../server/types/types';

export interface UsernameAsyncValidatorOptions {
  debounceTime: number;
  service: any;
}

/**
 * Takes 2 arguments: debounceTime, service.
 * - Debounce time in ms.
 * - Service to be used to connect to external.
 * E.g. usernameAsyncValidator({debounceTime: 500, service: this.userService})
 * Use in the Angular reactive forms aSync validator array (third in array).
*/
export function usernameAsyncValidator(options: UsernameAsyncValidatorOptions) {

  const validator = new UsernameAsyncValidator(options);

  return function validateUsername(control: FormControl) {
    return validator.usernameValidator(control.value);
  };

}

export class UsernameAsyncValidator {

  constructor(
    private options: UsernameAsyncValidatorOptions,
  ) { }

  usernameValidator(value: string) {
    if (!value) {
      return new Promise((resolve) => {
        resolve(null);
      });
    }
    return Observable.timer(this.options.debounceTime).switchMap(() => {
      return this.options.service.checkUsername(value).map((response: boolean) => {
        if (response) { return 'true'; }
        return null;
      }).catch((error: ErrorMessage) => { throw error; });
    });
  }
}
