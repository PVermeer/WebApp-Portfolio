import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import { MatDialog } from '@angular/material';

import { UserDialogComponent } from '../_components/user-dialog/user-dialog.component';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private http: HttpClient,
    private matDialog: MatDialog
  ) { }

  canActivate(): Observable<boolean> {
    return this.http.get('/users/auth', { observe: 'response' }).map(response => {
      if (response.status === 200) {
        return true;
      }
      return false;
      // }).catch(() => {
      // this.matDialog.open(UserDialogComponent);
      // return Observable.of(false);
    });
  }

}
