import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, DialogPosition, MAT_DIALOG_DATA } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

import { UserService } from '../../.././user.service';
import { SnackbarComponent } from '../../../../_shared/snackbar/snackbar.component';
import { passwordValidator, matchValidator } from '../../../validators';
import { DialogComponent } from '../../../../_shared/dialog/dialog.component';


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
  public updatePassword(userForm) {
    this.progressBar = true;
    this.userService.updateUserPassword(userForm, this.token).subscribe(response => {
      this.progressBar = false;

      if (response.error) {
        return this.snackbarComponent.snackbarError(response.error);
      }

      this.snackbarComponent.snackbarSucces(response.success);
      this.dialogComponenet.matDialog.close();
      this.router.navigate(['/user']);
    },
      error => {
        this.progressBar = false;
      });
  }

  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder,
    private snackbarComponent: SnackbarComponent,
    private router: Router,
    private dialogComponenet: DialogComponent,
  ) {
    this.userForm = this.validateForm();
    this.token = dialogComponenet.data.token;
  }

  // Lifecycle
  ngOnInit() {
    // Empty form validator
    this.userForm.valueChanges.subscribe(value => {
      if (Object.values(value).every(x => (x === null || x === ''))) { return this.userFormEmpty = true; }
      this.userFormEmpty = false;
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
