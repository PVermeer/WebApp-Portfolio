import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { SnackbarComponent } from './_modules/_shared/components/snackbar/snackbar.component';
import { UserService } from './_modules/users/user.service';
import { ErrorMessage } from '../../server/types/types';


@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  // Variables
  public dialogData: {};

  constructor(
    private snackbarComponent: SnackbarComponent,
    private userService: UserService,
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    // Check for error status on incomming responses
    return next.handle(request).catch((responseError: any) => {
      const error: ErrorMessage = responseError.error;

      // Handle errors
      if (responseError instanceof HttpErrorResponse) {
        const status = responseError.status;

        // Handle some errors special
        if (status === 401) {
          this.userService.login();

        } else if (status === 403) { // Do nothing

        } else if (status === 404) {
          this.snackbarComponent.snackbarError(error.message);

        } else if (status === 503) {
          this.snackbarComponent.snackbarError(error.message);

          // Handle all other errors
        } else {
          this.snackbarComponent.snackbarError(`${responseError.status} ${responseError.statusText}`);
        }
      }

      // Always throw catched responses
      let consoleError;
      if (error.message) { consoleError = error.message; } else { consoleError = error; }

      console.error(consoleError);
      return Observable.throw(error);
    });
  }

}
export const ErrorInterceptorProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: ErrorInterceptor,
  multi: true,
};
