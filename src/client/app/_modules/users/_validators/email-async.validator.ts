import { FormControl } from '@angular/forms';
import { timer } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';

import { ErrorMessage } from '../../../../../server/types/types';

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

  emailValidator(value: string) {
    if (!value) {
      return Promise.resolve(null);
    }
    return timer(this.options.debounceTime).pipe(switchMap(() => {
      return this.options.service.checkEmail(value).pipe(map((response: boolean) => {
        if (response) { return 'true'; }
        return null;
      }), catchError((error: ErrorMessage) => { throw error; }));
    }));
  }
}
