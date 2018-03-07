import { Component } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { usernameValidator, passwordValidator, matchValidator } from '../_models/validators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  public title = 'Login';

  // NgFor login input fields
  public loginFormInputfields = [
    {
      placeholder: 'Username or email',
      formControlName: 'nameEmail',
      alert: 'Required',
    }, {
      placeholder: 'Password',
      formControlName: 'password',
      alert: 'Minimal 8 characters',
    },
  ];

  // NgFor login input fields
  public registerFormInputfields = [
    {
      placeholder: 'First name',
      formControlName: 'firstName',
      alert: 'Required',
    }, {
      placeholder: 'Last name',
      formControlName: 'lastName',
      alert: 'Required',
    }, {
      placeholder: 'Username',
      formControlName: 'userName',
      alert: '3 - 15 Characters and no special characters',
    }, {
      placeholder: 'Email',
      formControlName: 'email',
      alert: 'Not a valid email address',
    }, {
      placeholder: 'Password',
      formControlName: 'password',
      alert: 'Minimal 8 characters',
    }, {
      placeholder: 'Confirm password',
      formControlName: 'passwordConfirm',
      alert: 'Passwords do not match',
    },
  ];

  // Variables
  public loginForm: FormGroup;
  public registerForm: FormGroup;
  public progressBar = false;

  // Events
  public login(loginForm) {
    console.log(loginForm);
  }

  public register(loginForm) {
    console.log(loginForm);
  }

  constructor(
    private formBuilder: FormBuilder,
  ) {
    // Form validation
    this.loginForm = this.validateLogin();
    this.registerForm = this.validateRegister();
  }

  // ---------------------------------------------------------------------------

  // Constructor methods
  private validateLogin() {
    return this.formBuilder.group({
      nameEmail: [null, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(50)])],
      password: [null, Validators.compose([Validators.required, Validators.minLength(8)])],
      lname: [null, Validators.compose([Validators.maxLength(0)])],
    });
  }

  private validateRegister() {
    return this.formBuilder.group({
      firstName: [null, Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(50)])],

      lastName: [null, Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(50)])],

      userName: [null, Validators.compose([
        Validators.required, usernameValidator({ noSpecialCharacters: true, minLength: 3, maxLength: 15 })
      ])],

      email: [null, Validators.compose([Validators.required, Validators.email])],

      lname: [null, Validators.compose([Validators.maxLength(0)])],

      password: [null, Validators.compose([
        Validators.required, passwordValidator({ minLength: 8, maxLength: 20 })
      ])],

      passwordConfirm: [null, Validators.compose([
        Validators.required, matchValidator('password')
      ])],
    });
  }

}
