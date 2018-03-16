import { Component, OnInit } from '@angular/core';

import { UserService } from '../_services/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
  providers: [UserService],
})
export class UserComponent implements OnInit {

  public info: string;

  constructor(
    private userService: UserService,
  ) { }

  public logout() {
    this.userService.logout();
  }

  public userInfo() {
    this.userService.userInfo().subscribe((response) => {
    this.info = JSON.stringify(response);
    });
  }

  ngOnInit() {
  }

}
