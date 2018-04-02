import { Component } from '@angular/core';
import { UserService } from '../../../_services/user.service';
import { SelectionModel } from '@angular/cdk/collections';
import { SnackbarComponent } from '../../../_components/snackbar/snackbar.component';
import { MatDialog, MatTableDataSource } from '@angular/material';
import { UserManyDialogComponent } from './many-dialog/user-many-dialog.component';

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
      email: 'mock' + this.counter + '@user.nl',
      password: 'mockuser',
    };
  });

  // Methods
  private getUsers() { this.userService.getAllUsers().subscribe(res => { this.dataSource.data = res; }); }

  public isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  public masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  public action() {
    const transactions = [];
    this.selection.selected.forEach(selected => transactions.push(selected._id));

    let actionText;
    switch (this.selectedAction) {
      case 'deleteUser': actionText = 'delete'; break;
      case 'resetPassword': actionText = 'reset the password of'; break;
      default: throw new Error('Not matching any action');
    }

    this.userService.UserMany(transactions).subscribe(response => {
      const dialog = this.matDialog.open(

        UserManyDialogComponent, {
          data: {
            id: response.id, lengthTransactions: transactions.length, actionText, action: this.selectedAction,
          }
        }
      );

      dialog.afterClosed().subscribe((success) => {
        if (success) { this.selection.clear(); this.getUsers(); }
      });
    });
  }

  public mockUsers = async () => { // Refactor
    const requests = this.users.map(user => {
      return new Promise((resolve) => {
        this.userService.createMockUser(user).subscribe(response => {
          if (response.error) {
            return this.snackbarComponent.snackbarError(response.error); // Change this!
          }
          resolve();
        });
      });
    });
    await Promise.all(requests);

    this.snackbarComponent.snackbarSucces('Mock user(s) created');
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
