import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { UserService } from '../_services/user.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private userService: UserService,
  ) { }

  async canActivate(): Promise<boolean> {
    const isLoggedIn = await this.userService.checkLogin();
    if (isLoggedIn) { return true; }

    const login = await this.userService.login();
    if (login) { return true; }

    return false;
  }

}
