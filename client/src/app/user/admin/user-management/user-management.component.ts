import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../_services/user.service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {

  // Variables
  public userArray = [];
  public columnsToDisplay = ['userName', 'firstName', 'lastName', 'type', 'email', 'created_at'];

  constructor(
    private userService: UserService,
  ) {
    this.userService.getAllUsers().subscribe(response => {
      console.log(response);
      this.userArray = response;
    });
   }

  // Methods
  public getAllUsers() {
  }

  ngOnInit() {
  }

}
