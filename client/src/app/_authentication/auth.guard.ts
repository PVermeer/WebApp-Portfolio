import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private http: HttpClient,
  ) { }

  canActivate(): Observable<boolean> {
    return this.http.get('/users/auth', { observe: 'response' }).map(response => {
      if (response.status === 200) {
        return true;
      }
    }).catch(() => {
      this.router.navigate(['/login']);
      return Observable.of(false);
    });
  }

}
