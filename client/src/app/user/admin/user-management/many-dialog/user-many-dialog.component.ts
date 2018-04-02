import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, DialogPosition, MAT_DIALOG_DATA } from '@angular/material';

import { DialogComponent } from '../../../../_components/dialog/dialog.component';
import { UserService } from '../../../../_services/user.service';
import { SnackbarComponent } from '../../../../_components/snackbar/snackbar.component';

@Component({
  selector: 'app-user-many-dialog',
  templateUrl: './user-many-dialog.component.html',
  styleUrls: ['./user-many-dialog.component.css']
})
export class UserManyDialogComponent implements OnInit {

  // Variables
  private dialogPosition: DialogPosition = { top: '160px' };
  private manyLength = this.data.lengthTransactions;
  private id = this.data.id;
  private actionText = this.data.actionText;
  private action = this.data.action;

  public progressbar = false;
  public title = 'Confirmation';
  public body = `Are you sure you want to ${this.actionText} ${this.manyLength} users?`;
  public button = 'Yes, i\'m sure!';

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
          this.matDialog.close(response.success);
        });
        break;

      default: this.progressbar = false; throw new Error('Not matching any case');
    }
  }

  constructor(
    private matDialog: MatDialogRef<UserManyDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private userService: UserService,
    private snackbarComponent: SnackbarComponent,
  ) { }

  ngOnInit() {
    // Dialog options
    this.matDialog.updatePosition(this.dialogPosition);
  }

}
