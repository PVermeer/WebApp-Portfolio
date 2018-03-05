import { Component } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { PasswordValidator } from '../_models/validation';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  public title = 'Login';

  // Placeholders
  public firstName = 'First name';
  public lastName = 'Last name';
  public userName = 'User name';
  public email = 'email';
  public userNameEmail = 'Username or email';
  public password = 'Password';
  public passwordConfirm = 'Confirm password';

  // Variables
  public loginForm: FormGroup;
  public registerForm: FormGroup;
  public progressBar = false;

  // Alerts
  public nameAlert = 'Required';
  public emailAlert = 'Not a valid email address';
  public passwordAlert = 'Minimal 8 characters';
  public passwordConfirmAlert = 'Passwords do not match';
  public lnameAlert = '';

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
      userName: [null, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(15)])],
      email: [null, Validators.compose([Validators.required, Validators.email])],
      lname: [null, Validators.compose([Validators.maxLength(0)])],
      password: [null, Validators.compose([Validators.required, Validators.minLength(8)])],
      passwordConfirm: [null, Validators.compose([Validators.required, PasswordValidator.matchPassword('password')])],
    }
    );
  }
}
