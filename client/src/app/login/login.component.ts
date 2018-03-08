import { Component } from '@angular/core';
import { FormGroup, Validators, FormBuilder, ValidatorFn, AbstractControl, FormControl, ValidationErrors } from '@angular/forms';
import { usernameValidator, passwordValidator, matchValidator, userNameAsyncValidator } from '../_models/validators';
import { Router } from '@angular/router';
import { UserService } from '../_services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [UserService],
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

  public register(registerForm) {
    this.progressBar = true;
    const userNameIndex = registerForm.userName;
    registerForm.userNameIndex = userNameIndex;
    this.userService.create(registerForm)
      .subscribe(data => {
        console.log('Registration successful');
        this.progressBar = false;
        // this.router.navigate(['/login']);
      },
        error => {
          console.log(error);
          this.progressBar = false;
        });
  }

  checkForm() {
    console.log(this.registerForm.controls['userName']);
  }


  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService,
  ) {
    // Form validation
    this.loginForm = this.validateLogin();
    this.registerForm = this.validateRegister();
  }

  // -----------------Constructor methods------------------------

  // Standard validations
  private validateLogin() {
    return this.formBuilder.group({
      nameEmail: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      password: [null, [Validators.required, Validators.minLength(8)]],
      lname: [null, [Validators.maxLength(0)]],
    });
  }

  private validateRegister() {
    return this.formBuilder.group({
      firstName: [null, [
        Validators.required, Validators.minLength(2),
        Validators.maxLength(50)
      ]],

      lastName: [null, [
        Validators.required, Validators.minLength(2),
        Validators.maxLength(50)
      ]],

      userName: [null, [
        Validators.required,
        usernameValidator({ noSpecialCharacters: true, minLength: 3, maxLength: 15 }),
      ], [userNameAsyncValidator({ debounceTime: 500, service: this.userService })]
      ],

      email: [null, [Validators.required, Validators.email]],

      lname: [null, [Validators.maxLength(0)]],

      password: [null, [
        Validators.required, passwordValidator({ minLength: 8, maxLength: 20 })
      ]],

      passwordConfirm: [null, [
        Validators.required, matchValidator('password')
      ]],
    });
  }

}
