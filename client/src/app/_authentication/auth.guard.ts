import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private http: HttpClient,
  ) { }

  canActivate(): Observable<boolean> {
    return this.http.get('/users/auth', { observe: 'response' }).map(response => {
      if (response.status === 200) {
        return true;
      }
      return false;
    });
  }

}
