import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { UserService } from '../.././user.service';
import { SnackbarComponent } from '../../../_shared/snackbar/snackbar.component';
import { DialogComponent } from '../../../_shared/dialog/dialog.component';
import { UserDialogComponent } from '../user-dialog.component';

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
  public login(loginForm) {
    this.userDialogComponent.progressBar = true;

    // Login user
    this.userService.loginUser(loginForm).subscribe(response => {
      this.userDialogComponent.progressBar = false;

      if (response.error) {
        return this.snackbarComponent.snackbarError(response.error);
      }
      this.snackbarComponent.snackbarSucces(response.success);
      this.dialogComponent.matDialog.close(true);
    },
      () => {
        this.userDialogComponent.progressBar = false;
      });
  }

  public recoverPassword(loginForm) {
    this.userDialogComponent.progressBar = true;
    const user = { email: loginForm.email };

    this.userService.recoverUserPassword(user).subscribe(response => {
      this.userDialogComponent.progressBar = false;

      if (response.error) {
        return this.snackbarComponent.snackbarError(response.error);
      }

      this.snackbarComponent.snackbarSucces(response.success);
      this.dialogComponent.matDialog.close(false);
    },
      () => {
        this.userDialogComponent.progressBar = false;
      });
  }

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private snackbarComponent: SnackbarComponent,
    private dialogComponent: DialogComponent,
    private userDialogComponent: UserDialogComponent,
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
