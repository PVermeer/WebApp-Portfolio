import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { UserService } from './user.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private userService: UserService,
    private router: Router,
  ) { }

  async canActivate() {

    // Check login with the backend
    const isLoggedIn = await this.userService.checkLogin();
    if (isLoggedIn) { return true; }

    // Open login and await the result
    const login = await this.userService.login();
    if (login) { return true; }

    this.router.navigate(['home']);
    return false;
  }

}
