import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { UserService } from '../.././user.service';
import { SnackbarComponent } from '../../../_shared/snackbar/snackbar.component';
import { DialogComponent } from '../../../_shared/dialog/dialog.component';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css'],
})
export class ConfirmDialogComponent implements OnInit {

  // Variables
  public title = 'Your new user details';
  public confirmForm: FormGroup;
  public progressBar = false;
  public userFormFields = this.dialogComponent.data.userFormFields;
  public userForm: FormGroup = this.dialogComponent.data.userForm;

  // Methods
  public updateUser(userForm) {
    this.progressBar = true;

    this.userService.updateUser(userForm).subscribe(response => {
      this.progressBar = false;

      if (response.error) {
        return this.snackbarComponent.snackbarError(response.error);
      }

      this.snackbarComponent.snackbarSucces(response.success);
      this.userForm.reset();
      this.dialogComponent.matDialog.close('success');
    },
      () => {
        this.progressBar = false;
      });
  }

  public closeDialog() {
    this.dialogComponent.matDialog.close();
  }

  constructor(
    private userService: UserService,
    private snackbarComponent: SnackbarComponent,
    private dialogComponent: DialogComponent,
  ) { }

  // Lifecycle
  ngOnInit() {
    this.userForm.disable();
  }

}
