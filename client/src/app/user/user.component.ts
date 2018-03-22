import { Component } from '@angular/core';

import { UserService } from '../_services/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
  providers: [UserService],
})
export class UserComponent {

  public logout() {
    this.userService.logout();
  }

  constructor(
    private userService: UserService,
  ) { }


}
