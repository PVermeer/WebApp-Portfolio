import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';

import { UserService } from '../.././user.service';
import { SnackbarComponent } from '../../../_shared/snackbar/snackbar.component';
import { DialogComponent, DialogContent } from '../../../_shared/dialog/dialog.component';
import { UserDialogComponent } from '../user-dialog.component';
import { UserLogin, UserRegister } from '../../_models/user.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {

  // Variables
  public loginForm: FormGroup;

  // NgFor login input fields
  public loginFormInputfields = [
    {
      placeholder: 'Email',
      formControlName: 'email',
      type: 'text',
      alert: 'Not a valid e-mail address',
      asyncAlert: '',
    }, {
      placeholder: 'Password',
      formControlName: 'password',
      type: 'password',
      alert: '8 -50 Characters',
      asyncAlert: '',
    },
  ];

  // Methods
  public login(loginForm: UserLogin) {
    this.userDialogComponent.progressBar = true;

    // Login user
    this.userService.loginUser(loginForm).subscribe(response => {
      this.userDialogComponent.progressBar = false;

      this.snackbarComponent.snackbarSuccess(response);
      this.dialogComponent.matDialog.close(true);

      // Catch errors
    }, (error) => {
      this.userDialogComponent.progressBar = false;

      // If e-mail is not verified open dialog to notify user
      if (error.status === 403) {
        const data: DialogContent = {
          dialogData: {
            title: 'Something\'s wrong...', body: error.message, button: 'Okay'
          }
        }; this.matDialog.open(DialogComponent, { data });
      }
    });
  }

  public recoverPassword(loginForm: UserRegister) {
    this.userDialogComponent.progressBar = true;
    const user = { email: loginForm.email };

    // Password recovery request
    this.userService.recoverUserPassword(user).subscribe(response => {
      this.userDialogComponent.progressBar = false;

      this.snackbarComponent.snackbarSuccess(response);
      this.dialogComponent.matDialog.close(false);

      // Catch errors
    }, () => this.userDialogComponent.progressBar = false);
  }

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private snackbarComponent: SnackbarComponent,
    private dialogComponent: DialogComponent,
    private userDialogComponent: UserDialogComponent,
    private matDialog: MatDialog,
  ) {
    // Form validation
    this.loginForm = this.validateLogin();
  }

  // -----------------Constructor methods------------------------

  // Validations
  private validateLogin() {
    return this.formBuilder.group({
      email: ['asd@asd', [
        Validators.required,
        Validators.email,
      ]],
      password: ['password', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(50),
      ]],
      lname: [null, [
        Validators.maxLength(50),
      ]],
    });
  }

}
