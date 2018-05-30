import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { UserRegister } from '../../../../../../../server/database/models/users/user.types';
import { DialogComponent, DialogContent } from '../../../_shared/components/dialog/dialog.component';
import { SnackbarComponent } from '../../../_shared/components/snackbar/snackbar.component';
import { UserService } from '../.././user.service';


@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styles: [''],
})
export class ConfirmDialogComponent implements OnInit {

  // Variables
  public title = 'Your new user details';
  public confirmForm: FormGroup;
  public progressBar = false;
  public userFormFields = this.dialogComponent.data.userFormFields;
  public userForm: FormGroup = this.dialogComponent.data.userForm;

  // Methods
  public updateUser(userForm: UserRegister) {
    this.progressBar = true;

    // Send update request
    this.userService.updateUser(userForm).subscribe(response => {
      this.progressBar = false;

      this.snackbarComponent.snackbarSuccess(response);
      this.userForm.reset();
      this.dialogComponent.matDialog.close('success');

      if (userForm.email) {
        const data: DialogContent = {
          dialogData: {
            title: 'E-mail update',
            body: 'Check your inbox of your new e-mail to verify your new e-mail address',
            button: 'Ok!',
          }
        };
        this.matDialog.open(DialogComponent, { data });
      }

      // Catch errors
    }, () => {
      this.progressBar = false;
    });
  }

  public closeDialog() { this.dialogComponent.matDialog.close(); }

  constructor(
    private userService: UserService,
    private snackbarComponent: SnackbarComponent,
    private dialogComponent: DialogComponent,
    private matDialog: MatDialog,
  ) { }

  ngOnInit() {
    // this.userForm.disable();
  }

}
