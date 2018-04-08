import { Component } from '@angular/core';

import { UserService } from '../../.././user.service';
import { SnackbarComponent } from '../../../../_shared/snackbar/snackbar.component';
import { DialogComponent } from '../../../../_shared/dialog/dialog.component';

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

  public progressbar = false;
  public title = 'Confirmation';
  public body = `Are you sure you want to ${this.actionText} ${this.manyLength} users?`;
  public button = 'Yes, i\'m sure!';
  public button2 = 'Cancel';

  // Methods
  public execute() {
    this.progressbar = true;
    switch (this.action) {

      case 'deleteUser':
        this.userService.deleteUserMany(this.id).subscribe(response => {
          this.progressbar = false;
          if (response.error) {
            return this.snackbarComponent.snackbarError(response.error);
          }
          this.snackbarComponent.snackbarSucces(response.success);
          this.dialogComponent.matDialog.close(response.success);
        });
        break;

      default: this.progressbar = false; throw new Error('Not matching any case');
    }
  }

  public cancel() {
    this.dialogComponent.matDialog.close();
  }

  constructor(
    private dialogComponent: DialogComponent,
    private userService: UserService,
    private snackbarComponent: SnackbarComponent,
  ) { }

}
