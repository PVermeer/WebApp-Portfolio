import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import 'rxjs/add/operator/map';


@Injectable()
export class AuthenticationService {

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  public logout() {
    localStorage.removeItem('currentUser');
    this.router.navigate(['/home']);
  }

}
