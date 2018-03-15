import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import 'rxjs/add/operator/map';

import { LoginForm } from '../_models/user.model';

@Injectable()
export class AuthenticationService {

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  public login(loginForm: LoginForm) {
    return this.http.post<any>('/users/login', loginForm).map((response, error) => {
      if (response.success) {
        this.router.navigate(['/user']);
      }
      // Todo: error
    });
  }

  public logout() {
    localStorage.removeItem('currentUser');
    this.router.navigate(['/home']);
  }

}
