import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Subscription } from 'rxjs';
import { DialogComponent, DialogContent } from '../../_shared/components/dialog/dialog.component';
import { SnackbarComponent } from '../../_shared/components/snackbar/snackbar.component';
import { UserService } from '../user.service';
import { UserManyDialogComponent } from './many-dialog/user-many-dialog.component';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styles: ['']
})
export class UserManagementComponent implements OnInit, OnDestroy {

  // Get elements
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  // Variables
  public dataSource = new MatTableDataSource<any>();
  public selection = new SelectionModel<any>(true, []);
  public selectedAction: string;
  public progressBar = false;
  public disableButtons = false;
  public searchInput: string;
  public isDeveloper = false;

  public columnsToDisplay = ['select', 'username', 'firstName', 'lastName', 'type', 'email', 'created_at'];
  public options = [
    { action: 'deleteUser', view: 'Delete user(s)' },
    { action: 'blockUser', view: 'Block user(s)' },
    { action: 'unblockUser', view: 'Unblock user(s)' },
  ];

  private subscriptions = new Subscription;

  // Methods
  private getUsers() {
    this.progressBar = true;

    // Get all users from db
    this.userService.getAllUsers().subscribe(response => {
      this.progressBar = false;

      // Convert type object to string
      const table = response.map((x: any) => { x.type = x.type.value; return x; });

      this.dataSource.data = table;

      // Catch errors
    }, () => {
      this.progressBar = false;
      this.dataSource.data = [];
    });
  }

  public isAllSelected() {

    // Check if all are selected
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.filteredData.length;
    return numSelected === numRows;
  }

  public masterToggle() {

    // Checkbox control
    if (this.isAllSelected()) { return this.selection.clear(); }
    this.dataSource.filteredData.forEach(row => this.selection.select(row));
  }

  public action() {
    this.progressBar = true;
    this.disableButtons = true;

    // Create a id array from selection
    const transactions: Array<string> = [];
    this.selection.selected.forEach(selected => transactions.push(selected._id));

    // Define the selected action
    let actionText: string;
    switch (this.selectedAction) {
      case 'deleteUser': actionText = 'delete'; break;
      case 'blockUser': actionText = 'block'; break;
      case 'unblockUser': actionText = 'unblock'; break;
      case 'makeAdmin': actionText = 'promote'; break;
      case 'makeUser': actionText = 'demote'; break;
      default: this.progressBar = false; throw new Error('Not matching any action');
    }

    // Create a temporary many action document in the db
    this.userService.UserMany(transactions).subscribe(response => {
      this.progressBar = false;

      // Open confirm dialog
      const data: DialogContent = {
        component: UserManyDialogComponent,
        id: response,
        lengthTransactions: transactions.length,
        actionText, action: this.selectedAction,
        selected: this.selection.selected,
      };
      const dialog = this.matDialog.open(DialogComponent, { data });

      // Reset the table on success and if reset is true
      dialog.afterClosed().subscribe((reset) => {
        if (reset) {
          this.selection.clear();
          this.getUsers();
        }
        this.disableButtons = false;
      });

      // Catch errors
    }, () => {
      this.progressBar = false;
      this.disableButtons = false;
      this.getUsers();
    });
  }

  private createMockUser() {
    const counter = Math.floor((Math.random() * 1000));
    return {
      firstName: 'Mock ' + counter,
      lastName: 'User' + counter,
      username: 'mockUser' + counter,
      email: 'mock@mock' + counter,
      password: 'password',
      passwordConfirm: '',
      lname: '',
    };
  }

  public mockUser = async () => { // Testing purposes
    this.progressBar = true;

    this.userService.createMockUser(this.createMockUser()).subscribe(() => {

      this.snackbarComponent.snackbarSuccess('Mock user(s) created');
      this.selection.clear();
      this.getUsers();

      // On error
    }, () => { this.progressBar = false; });
  }

  public applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  public clearSearch() {
    this.searchInput = '';
    this.applyFilter('');
  }

  constructor(
    private userService: UserService,
    private snackbarComponent: SnackbarComponent,
    public matDialog: MatDialog,
  ) {
    this.getUsers();
  }

  ngOnInit() {
    const userType = this.userService.userType$.subscribe(type => {
      if (type.rank > 3) {
        this.options.push({ action: 'makeAdmin', view: 'Promote to admin' });
        this.options.push({ action: 'makeUser', view: 'Demote to user' });
      }
      if (type.value === 'developer') { this.isDeveloper = true; }
    });
    this.subscriptions.add(userType);

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

}
