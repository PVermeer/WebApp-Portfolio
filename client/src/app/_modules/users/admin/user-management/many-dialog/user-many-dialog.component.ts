import { Component } from '@angular/core';
import { MatDialog } from '@angular/material';

import { UserService } from '../../.././user.service';
import { SnackbarComponent } from '../../../../_shared/snackbar/snackbar.component';
import { DialogComponent } from '../../../../_shared/dialog/dialog.component';
import { UserManyErrorDialogComponent } from './user-many-error-dialog/user-many-error-dialog.component';

@Component({
  selector: 'app-user-many-dialog',
  templateUrl: './user-many-dialog.component.html',
  styleUrls: ['./user-many-dialog.component.css']
})
export class UserManyDialogComponent {

  // Variables
  private manyLength = this.dialogComponent.data.lengthTransactions;
  private id = this.dialogComponent.data.id;
  private actionText = this.dialogComponent.data.actionText;
  private action = this.dialogComponent.data.action;
  private selected = this.dialogComponent.data.selected;

  public progressbar = false;
  public title = 'Confirmation';
  public body = `Are you sure you want to ${this.actionText} ${this.manyLength} users?`;
  public button = 'Yes, i\'m sure!';
  public button2 = 'Cancel';
  private success = 'All operations successful';

  // Methods
  public async execute() {
    this.progressbar = true;
    let response: any;

    switch (this.action) {
      case 'deleteUser': response = await this.userService.deleteUserMany(this.id).first().toPromise(); break;
      case 'resetPassword': response = await this.userService.resetPasswordUserMany(this.id).first().toPromise(); break;
      default: this.progressbar = false; throw new Error('Not matching any case');
    }

    this.progressbar = false;

    let errorCheck = [];
    response.forEach(x => errorCheck = [...errorCheck, ...Object.keys(x.response)]);

    const isError = errorCheck.some(x => x === 'error');

    if (isError) {
      this.dialogComponent.matDialog.close(true);
      return this.matDialog.open(DialogComponent, {
        data: {
          component: UserManyErrorDialogComponent,
          response,
          selected: this.selected,
        }
      });
    }

    this.snackbarComponent.snackbarSucces(this.success);
    this.dialogComponent.matDialog.close(true);
  }

  public cancel() {
    this.dialogComponent.matDialog.close();
  }

  constructor(
    private dialogComponent: DialogComponent,
    private userService: UserService,
    private snackbarComponent: SnackbarComponent,
    private matDialog: MatDialog,
  ) { }

}
