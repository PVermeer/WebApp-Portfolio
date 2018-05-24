import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { UserLogin } from '../../../../../../server/database/models/users/user.types';
import { DialogComponent, DialogContent } from '../../../_shared/components/dialog/dialog.component';
import { SnackbarComponent } from '../../../_shared/components/snackbar/snackbar.component';
import { UserService } from '../.././user.service';
import { UserDialogComponent } from '../user-dialog.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {

  // Variables
  public loginForm: FormGroup;
  private username = 'asd@asd'; // Dev setting
  public usernameDisable = false;
  public disableButtons = false;

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
  public login() {
    this.userDialogComponent.progressBar = true;
    this.disableButtons = true;

    // Login user
    this.userService.loginUser(this.loginForm.getRawValue()).subscribe(response => {
      this.userDialogComponent.progressBar = false;
      this.disableButtons = false;

      this.snackbarComponent.snackbarSuccess(response);
      this.dialogComponent.matDialog.close(true);

      // Catch errors
    }, (error) => {
      this.errorHandler(error);
    });
  }

  private errorHandler(error: any) {
    this.userDialogComponent.progressBar = false;
    this.disableButtons = false;

    // If e-mail is not verified open dialog to notify user
    if (error.status === 403) {
      const data: DialogContent = {
        dialogData: {
          title: 'Something\'s wrong...',
          body: error.message,
          button: 'Okay',
          button2: 'Resend verification mail'
        }
      };
      const dialog = this.matDialog.open(DialogComponent, { data, disableClose: true });

      dialog.afterClosed().subscribe(response => {
        // User pressed ok
        if (response) { return; }

        // User presses resend verificationmail
        this.userDialogComponent.progressBar = true;
        this.disableButtons = true;

        this.userService.resendVerificationMail(this.loginForm.value).subscribe(res => {
          this.userDialogComponent.progressBar = false;
          this.disableButtons = false;

          this.snackbarComponent.snackbarSuccess(res);

          // Catch errors
        }, () => {
          this.userDialogComponent.progressBar = false;
          this.disableButtons = false;
        });
      });
    }
    // If user is blocked open dialog to notify user
    if (error.status === 401) {
      const data: DialogContent = {
        dialogData: {
          title: 'Something\'s wrong...',
          body: error.message,
          button: 'Okay',
        }
      };
      this.matDialog.closeAll();
      this.matDialog.open(DialogComponent, { data, disableClose: true });
    }
  }

  public recoverPassword(loginForm: UserLogin) {
    this.userDialogComponent.progressBar = true;
    const user = { email: loginForm.email };

    // Password recovery request
    this.userService.recoverUserPassword(user).subscribe(response => {
      this.userDialogComponent.progressBar = false;

      this.snackbarComponent.snackbarSuccess(response);
      this.dialogComponent.matDialog.close(false);

      // Catch errors
    }, (error) => {
      this.errorHandler(error);
    });

  }

  // Form validations
  private validateLogin() {
    return this.formBuilder.group({
      email: [{ value: this.username, disabled: this.usernameDisable }, [
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

  // Life cycle
  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private snackbarComponent: SnackbarComponent,
    private dialogComponent: DialogComponent,
    private userDialogComponent: UserDialogComponent,
    private matDialog: MatDialog,
  ) {
    // Form validation
    if (this.dialogComponent.data.username) {
      this.username = this.dialogComponent.data.username;
      this.usernameDisable = true;
    }
    this.loginForm = this.validateLogin();
  }

}
