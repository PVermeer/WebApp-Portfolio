import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';

import { UserService } from './user.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private userService: UserService,
  ) { }

  async canActivate(): Promise<boolean> {

    // Check login with the backend
    const isLoggedIn = await this.userService.checkLogin();
    if (isLoggedIn) { return true; }

    // Open login and await the result
    const login = await this.userService.login();
    if (login) { return true; }

    return false;
  }

}
