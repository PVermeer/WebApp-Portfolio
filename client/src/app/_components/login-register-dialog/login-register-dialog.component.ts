import { Component, ViewChild, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialogRef, DialogPosition } from '@angular/material';

import { usernameValidator, passwordValidator, matchValidator, usernameAsyncValidator,
  emailAsyncValidator } from '../../_models/validators';
import { UserService } from '../../_services/user.service';
import { SnackbarComponent } from '../snackbar/snackbar.component';


@Component({
  selector: 'app-login-register-dialog',
  templateUrl: './login-register-dialog.component.html',
  styleUrls: ['./login-register-dialog.component.css'],
  providers: [UserService, SnackbarComponent],
})
export class LoginRegisterDialogComponent implements OnInit {

  @ViewChild('regForm') private regForm;

  // Variables
  public title = 'Login';
  public tabPage = 0;
  private dialogPosition: DialogPosition = { top: '25%' };
  public loginForm: FormGroup;
  public registerForm: FormGroup;
  public progressBar = false;

  // NgFor login input fields
  public loginFormInputfields = [
    {
      placeholder: 'Email',
      formControlName: 'email',
      type: 'text',
      alert: '3 - 50 Characters',
      asyncAlert: '',
    }, {
      placeholder: 'Password',
      formControlName: 'password',
      type: 'password',
      alert: '8 -50 Characters',
      asyncAlert: '',
    },
  ];

  // NgFor register input fields
  public registerFormInputfields = [
    {
      placeholder: 'First name',
      formControlName: 'firstName',
      type: 'text',
      alert: '1 - 50 Characters, pretty please.',
      asyncAlert: '',
    }, {
      placeholder: 'Last name',
      formControlName: 'lastName',
      type: 'text',
      alert: '1 - 50 Characters, pretty please.',
      asyncAlert: '',
    }, {
      placeholder: 'Username',
      formControlName: 'username',
      type: 'text',
      alert: '3 - 50 Characters and no special characters, thanks!',
      asyncAlert: 'Username is already taken :(',
    }, {
      placeholder: 'Email',
      formControlName: 'email',
      type: 'text',
      alert: 'Not a valid e-mail address',
      asyncAlert: 'E-mail already exists, you\'re not new!',
    }, {
      placeholder: 'Password',
      formControlName: 'password',
      type: 'password',
      alert: '8 -50 Characters, pretty please.',
      asyncAlert: '',
    }, {
      placeholder: 'Confirm password',
      formControlName: 'passwordConfirm',
      type: 'password',
      alert: 'Oh ow, passwords do not match',
      asyncAlert: '',
    },
  ];

  // Events
  public login(loginForm) {
    this.progressBar = true;

    // Login user
    this.userService.login(loginForm).subscribe(response => {
      this.progressBar = false;

      if (response.error) {
        return this.snackbarComponent.snackbarError(response.error);
      }

      this.router.navigate(['/user']);
      this.snackbarComponent.snackbarSucces(response.success);
      this.matDialog.close();
    },
      error => {
        this.progressBar = false;
      });
  }

  // Register new user
  public register(registerForm) {
    this.progressBar = true;

    // Create username index
    const usernameIndex = registerForm.username;
    registerForm.usernameIndex = usernameIndex;

    // Create user
    this.userService.registerUser(registerForm).subscribe(response => {
      this.progressBar = false;
      this.tabPage = 0;
      this.regForm.resetForm();
      console.log(response);
    },
      error => {
        this.progressBar = false;
        console.log(error);
      });
  }

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService,
    private snackbarComponent: SnackbarComponent,
    private matDialog: MatDialogRef<LoginRegisterDialogComponent>,
  ) {
    // Form validation
    this.loginForm = this.validateLogin();
    this.registerForm = this.validateRegister();
  }

  ngOnInit() {
    // Dialog options
    this.matDialog.updatePosition(this.dialogPosition);
  }

  // -----------------Constructor methods------------------------

  // Standard validations
  private validateLogin() {
    return this.formBuilder.group({
      email: ['henkie@henk.nl', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
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

  private validateRegister() {
    return this.formBuilder.group({
      firstName: [null, [
        Validators.required, Validators.minLength(1),
        Validators.maxLength(50)
      ]],

      lastName: [null, [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(50),
      ]],

      username: [null, [
        Validators.required,
        usernameValidator({ noSpecialCharacters: true, minLength: 3, maxLength: 50 }),
      ], [
          usernameAsyncValidator({ debounceTime: 500, service: this.userService }),
        ]
      ],

      email: [null, [
        Validators.required,
        Validators.email
      ], [
          emailAsyncValidator({ debounceTime: 500, service: this.userService }),
        ]
      ],

      lname: [null, [
        Validators.maxLength(50),
      ]],

      password: [null, [
        Validators.required,
        passwordValidator({ minLength: 8, maxLength: 50 }),
      ]],

      passwordConfirm: [null, [
        Validators.required,
        passwordValidator({ minLength: 8, maxLength: 50 }),
        matchValidator('password'),
      ]],
    });
  }

}
