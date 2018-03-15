import { Component, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder, ValidationErrors } from '@angular/forms';
import { usernameValidator, passwordValidator, matchValidator, usernameAsyncValidator, emailAsyncValidator } from '../_models/validators';
import { Router } from '@angular/router';
import { UserService } from '../_services/user.service';
import { AuthenticationService } from '../_authentication/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [UserService, AuthenticationService],
})
export class LoginComponent {

  @ViewChild('regForm') regForm;

  public title = 'Login';
  public tabPage = 0;

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

  // Variables
  public loginForm: FormGroup;
  public registerForm: FormGroup;
  public progressBar = false;

  // Events
  public login(loginForm) {
    this.progressBar = true;

    // Login user
    this.authenticationService.login(loginForm).subscribe(user => {
      this.progressBar = false;
    },
      error => {
        console.log(error);
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
    private authenticationService: AuthenticationService,
  ) {
    // Form validation
    this.loginForm = this.validateLogin();
    this.registerForm = this.validateRegister();
  }

  // -----------------Constructor methods------------------------

  // Standard validations
  private validateLogin() {
    return this.formBuilder.group({
      email: [null, [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
      ]],
      password: [null, [
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
