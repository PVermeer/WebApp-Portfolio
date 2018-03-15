import { Component, OnInit } from '@angular/core';

import { AuthenticationService } from '../_authentication/auth.service';
import { UserService } from '../_services/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
  providers: [AuthenticationService, UserService],
})
export class UserComponent implements OnInit {

  public info: string;

  constructor(
    private authenticationService: AuthenticationService,
    private userService: UserService,
  ) { }

  public logout() {
    this.authenticationService.logout();
  }

  public userInfo() {
    this.userService.userInfo().subscribe((response) => {
    this.info = JSON.stringify(response);
    });
  }

  ngOnInit() {
  }

}
