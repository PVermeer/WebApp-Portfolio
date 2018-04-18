import { Component } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog, MatTableDataSource } from '@angular/material';

import { UserService } from '../.././user.service';
import { UserManyDialogComponent } from './many-dialog/user-many-dialog.component';
import { SnackbarComponent } from '../../../_shared/snackbar/snackbar.component';
import { DialogComponent, DialogContent } from '../../../_shared/dialog/dialog.component';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent {

  // Variables
  public dataSource = new MatTableDataSource<any[]>();
  public selection = new SelectionModel<any>(true, []);
  public selectedAction: string;
  public progressBar = false;
  public disableButtons = false;

  public columnsToDisplay = ['select', 'userName', 'firstName', 'lastName', 'type', 'email', 'created_at'];
  public options = [
    { action: 'deleteUser', view: 'Delete user(s)' },
    { action: 'resetPassword', view: 'Reset password(s)' }
  ];

  private counter = 0;
  private users = Array(5).fill(0).map(() => {
    this.counter += 1;
    return {
      firstName: 'Mock ' + this.counter,
      lastName: 'User' + this.counter,
      username: 'mockUser' + this.counter,
      email: 'mock@mock' + this.counter,
      password: 'mockuser',
    };
  });

  // Methods
  private getUsers() {
    this.progressBar = true;

    // Get all users from db
    this.userService.getAllUsers().subscribe(res => {

      // On success
      this.dataSource.data = res;
      this.progressBar = false;

      // Catch errors
    }, (error) => {
      this.progressBar = false;
      this.snackbarComponent.snackbarError(error);
    });
  }

  public isAllSelected() {

    // Check if all are selected
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  public masterToggle() {

    // Checkbox control
    if (this.isAllSelected()) { return this.selection.clear(); }
    this.dataSource.data.forEach(row => this.selection.select(row));
  }

  public action() {
    this.progressBar = true;
    this.disableButtons = true;

    // Create a id array from selection
    const transactions = [];
    this.selection.selected.forEach(selected => transactions.push(selected._id));

    // Define the selected action
    let actionText: string;
    switch (this.selectedAction) {
      case 'deleteUser': actionText = 'delete'; break;
      case 'resetPassword': actionText = 'reset the password of'; break;
      default: throw new Error('Not matching any action');
    }

    // Create a temporary many action document in the db
    this.userService.UserMany(transactions).subscribe(response => {
      this.progressBar = false;

      // Open confirm dialog
      const data: DialogContent = {
        component: UserManyDialogComponent,
        id: response.id,
        lengthTransactions: transactions.length,
        actionText, action: this.selectedAction,
        selected: this.selection.selected,
      };
      const dialog = this.matDialog.open(DialogComponent, { data });

      // Reset the table on success
      dialog.afterClosed().subscribe((reset) => {
        if (reset) { this.selection.clear(); this.getUsers(); }
        this.disableButtons = false;
      });

      // Catch errors
    }, (error) => {
      this.progressBar = true;
      this.disableButtons = false;
      this.snackbarComponent.snackbarError(error);
    });
  }

  public mockUsers = async () => { // Testing purposes
    this.progressBar = true;

    const requests = this.users.map(user => {
      return new Promise((resolve) => {
        this.userService.createMockUser(user).subscribe(response => {
          resolve(response);

          // On error
        }, () => { });
      });
    });
    await Promise.all(requests).catch(error => this.snackbarComponent.snackbarError(error));

    this.progressBar = false;
    this.snackbarComponent.snackbarSuccess('Mock user(s) created');
    this.getUsers();
  }

  constructor(
    private userService: UserService,
    private snackbarComponent: SnackbarComponent,
    public matDialog: MatDialog,
  ) {
    this.getUsers();
  }

}
