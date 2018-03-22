import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { MatDialog } from '@angular/material';
import 'rxjs/add/observable/throw';

import { UserDialogComponent } from '../_components/user-dialog/user-dialog.component';
import { SnackbarComponent } from '../_components/snackbar/snackbar.component';

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

      }
      this.snackbarComponent.snackbarError(responseError.status + ' ' + responseError.statusText);
      return Observable.throw(responseError.error);
    });
  }

}

export const ErrorInterceptorProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: ErrorInterceptor,
  multi: true,
};
