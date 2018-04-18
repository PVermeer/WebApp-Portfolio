import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

import { UserService } from '../../.././user.service';
import { SnackbarComponent } from '../../../../_shared/snackbar/snackbar.component';
import { passwordValidator, matchValidator } from '../../../validators';
import { DialogComponent, DialogContent } from '../../../../_shared/dialog/dialog.component';
import { MatDialog } from '@angular/material';
import { UserRegister } from '../../../_models/user.model';


@Component({
  selector: 'app-password-recovery-dialog',
  templateUrl: './password-recovery-dialog.component.html',
  styleUrls: ['./password-recovery-dialog.component.css'],
})
export class PasswordRecoveryDialogComponent implements OnInit {

  // Variables
  private token: string;
  public title = 'Enter new password';
  public progressBar = false;
  public userForm: FormGroup;
  public userFormEmpty = true;

  // NgFor fields
  public userFormFields = [
    {
      label: 'New password',
      placeholder: '',
      formControlName: 'password',
      type: 'password',
      alert: '8 -50 Characters, pretty please.',
      asyncAlert: '',
    }, {
      label: 'Confirm new password',
      placeholder: '',
      formControlName: 'passwordConfirm',
      type: 'password',
      alert: 'Oh ow, passwords do not match',
      asyncAlert: '',
    },
  ];

  // Methods
  public updatePassword(userForm: UserRegister) {
    this.progressBar = true;

    // Update the password with token
    this.userService.updateUserPassword(userForm, this.token).subscribe(response => {
      this.progressBar = false;

      this.snackbarComponent.snackbarSuccess(response);
      this.dialogComponent.matDialog.close();
      this.router.navigate(['/user']);

      // Catch errors
    }, (error) => {
      this.progressBar = false;

      // Open error dialog
      const data: DialogContent = { dialogData: { title: 'Oops..', body: error, button: 'Okay', }, };
      this.matDialog.open(DialogComponent, { data });
    });
  }

  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder,
    private snackbarComponent: SnackbarComponent,
    private router: Router,
    private dialogComponent: DialogComponent,
    private matDialog: MatDialog,
  ) {
    // Form validation
    this.userForm = this.validateForm();

    // Get token from parent
    this.token = dialogComponent.data.token;
  }

  ngOnInit() {
    // Empty form validator
    this.userForm.valueChanges.subscribe(value => {
      if (Object.values(value).every(x => (x === null || x === ''))) { return this.userFormEmpty = true; }
      return this.userFormEmpty = false;
    });
  }

  // Constructor methods
  private validateForm() {
    return this.formBuilder.group({
      password: [null, [
        passwordValidator({ minLength: 8, maxLength: 50 }),
      ]],

      passwordConfirm: [null, [
        passwordValidator({ minLength: 8, maxLength: 50 }),
        matchValidator('password'),
      ]],
    });
  }
}
