import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { MatDialog } from '@angular/material';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';

import { UserDialogComponent } from '../_components/user-dialog/user-dialog.component';
import { SnackbarComponent } from '../_components/snackbar/snackbar.component';
import { DialogComponent } from '../_components/dialog/dialog.component';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(
    private matDialog: MatDialog,
    private snackbarComponent: SnackbarComponent,
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).catch((responseError: any) => {
      if (responseError instanceof HttpErrorResponse) {
        const status = responseError.status;

        if (status === 401) { this.matDialog.open(UserDialogComponent); }
        if (status === 403) {
          this.matDialog.open(DialogComponent,
            {
              data: {
                title: responseError.status + ' ' + responseError.statusText,
                body: responseError.error,
                button: 'Okay'
              }
            });
        }

      }
      if (typeof responseError.error === 'string' || responseError.error instanceof String) {
        this.snackbarComponent.snackbarError(responseError.status + ' ' + responseError.error);
      } else {
        this.snackbarComponent.snackbarError(responseError.status + ' ' + responseError.statusText);
      }
      return Observable.throw(responseError.error);
    });
  }

}

export const ErrorInterceptorProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: ErrorInterceptor,
  multi: true,
};
