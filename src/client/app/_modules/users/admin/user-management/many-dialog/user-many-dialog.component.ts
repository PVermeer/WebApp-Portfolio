import { Component } from '@angular/core';
import { MatDialog } from '@angular/material';

import { UserService } from '../../.././user.service';
import { SnackbarComponent } from '../../../../_shared/snackbar/snackbar.component';
import { DialogComponent, DialogContent } from '../../../../_shared/dialog/dialog.component';
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

  public progressBar = false;
  public disableButtons = false;
  public title = 'Confirmation';
  public body = `Are you sure you want to ${this.actionText} ${this.manyLength} users?`;
  public button = 'Yes, i\'m sure!';
  public button2 = 'Cancel';
  // private success = 'All operations successful';

  // Methods
  public async execute(): Promise<void> {
    this.disableButtons = true;
    let error: any;
    this.progressBar = true;
    let response: string;
    let data: DialogContent;

    // Define the action
    switch (this.action) {

      case 'deleteUser':
        response = await this.userService.deleteUserMany(this.id).first().toPromise()
          .catch((err) => {
            error = err;
            data = { dialogData: { title: 'Some errors were detected', body: 'You can refresh the page and try again', button: 'Ok...' } };
          });
        break;

      case 'resetPassword':
        response = await this.userService.resetPasswordUserMany(this.id).first().toPromise()
          .catch((err) => {
            error = err;
            data = { component: UserManyErrorDialogComponent, error, selected: this.selected };
          });
        break;

      default: this.progressBar = false; throw new Error('Not matching any case');
    }

    this.progressBar = false;
    this.dialogComponent.matDialog.close(true);

    if (error) {
      const dialog = this.matDialog.open(DialogComponent, { data });
      dialog.afterClosed().subscribe(() => { this.disableButtons = false; });
      return;
    }

    this.snackbarComponent.snackbarSuccess(response);
    this.disableButtons = false;
  }

  public cancel() { this.dialogComponent.matDialog.close(); }

  constructor(
    private dialogComponent: DialogComponent,
    private userService: UserService,
    private snackbarComponent: SnackbarComponent,
    private matDialog: MatDialog,
  ) { }

}
