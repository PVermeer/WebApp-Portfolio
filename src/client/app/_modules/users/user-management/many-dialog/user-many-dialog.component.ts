import { Component } from '@angular/core';
import { MatDialog } from '@angular/material';

import { UserService } from '../.././user.service';
import { SnackbarComponent } from '../../../_shared/components/snackbar/snackbar.component';
import { DialogComponent, DialogContent } from '../../../_shared/components/dialog/dialog.component';
import { ErrorMessage } from '../../../../../../server/types/types';

@Component({
  selector: 'app-user-many-dialog',
  templateUrl: './user-many-dialog.component.html',
  styles: ['']
})
export class UserManyDialogComponent {

  // Variables
  private manyLength = this.dialogComponent.data.lengthTransactions;
  private id = this.dialogComponent.data.id;
  private actionText = this.dialogComponent.data.actionText;
  private action = this.dialogComponent.data.action;

  public progressBar = false;
  public disableButtons = false;
  public title = 'Confirmation';
  public body = `Are you sure you want to ${this.actionText} <b>${this.manyLength}</b> user(s)?`;
  public button = 'Yes, i\'m sure!';
  public button2 = 'Cancel';

  // Methods
  private errorHandler() {
    this.progressBar = false;
    this.dialogComponent.matDialog.close(false);
    return {
      dialogData: {
        title: 'Some errors were detected',
        body: 'You can refresh the page and try again or try to logout and login again',
        button: 'Ok...'
      }
    };
  }

  public async execute(): Promise<void> {
    this.disableButtons = true;
    this.progressBar = true;

    let error: ErrorMessage;
    let response: string | void;
    let data: DialogContent;

    // Define the action
    switch (this.action) {

      case 'deleteUser':
        response = await this.userService.deleteUserMany(this.id).toPromise()
          .catch(() => { data = this.errorHandler(); });
        break;

      case 'blockUser':
        response = await this.userService.blockUserMany(this.id).toPromise()
          .catch(() => { data = this.errorHandler(); });
        break;

      case 'unblockUser':
        response = await this.userService.unblockUserMany(this.id).toPromise()
          .catch(() => { data = this.errorHandler(); });
        break;

      case 'makeAdmin':
        response = await this.userService.makeAdminMany(this.id).toPromise()
          .catch((err) => { data = this.errorHandler(); error = err; });
        break;

      case 'makeUser':
        response = await this.userService.makeUserMany(this.id).toPromise()
          .catch((err) => { data = this.errorHandler(); error = err; });
        break;

      default: this.progressBar = false; throw new Error('Not matching any case');
    }

    if (error) {
      const dialog = this.matDialog.open(DialogComponent, { data });
      dialog.afterClosed().subscribe(() => { this.disableButtons = false; });
      return;
    }

    // Handle the action
    this.progressBar = false;
    this.dialogComponent.matDialog.close(true);
    this.snackbarComponent.snackbarSuccess(response as string);
    this.disableButtons = false;
  }

  public cancel() { this.dialogComponent.matDialog.close(); }

  // Life cycle
  constructor(
    private dialogComponent: DialogComponent,
    private userService: UserService,
    private snackbarComponent: SnackbarComponent,
    private matDialog: MatDialog,
  ) { }

}
