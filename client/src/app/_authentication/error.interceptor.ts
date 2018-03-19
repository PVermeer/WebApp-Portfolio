import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import { MatDialog } from '@angular/material';

import { UserDialogComponent } from '../_components/user-dialog/user-dialog.component';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(
    private matDialog: MatDialog
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).catch(errorResponse => {
      const status = errorResponse.status;
      if (status === 401) { this.matDialog.open(UserDialogComponent); }

      return Observable.throw(status);
    });
  }
}

export const ErrorInterceptorProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: ErrorInterceptor,
  multi: true,
};
