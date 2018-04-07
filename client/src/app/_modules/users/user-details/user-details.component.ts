import { Component, ViewChild, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { MatDialog } from '@angular/material';

import { UserService } from '.././user.service';
import {
  usernameValidator, usernameAsyncValidator, emailAsyncValidator,
  passwordValidator, matchValidator, emailValidator,
} from '../validators';
import { DialogComponent } from '../../_shared/dialog/dialog.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { SnackbarComponent } from '../../_shared/snackbar/snackbar.component';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css'],
})
export class UserDetailsComponent implements OnInit {

  // Get elements
  @ViewChild('slideToggle') private slideToggle;

  // Variables
  public userTitle = 'User details';
  public progressBar = false;
  public userForm: FormGroup;
  private user = {};
  public disableEdit: boolean;
  public userFormFields: Observable<Array<any>>;
  public disableButton = true;
  public userFormEmpty = true;

  // Methods
  private getUserInfo = () => {
    // NgFor input fields (async)
    this.userService.userInfo().subscribe((response) => {
      this.userFormFields = Observable.of([
        {
          label: 'First name',
          placeholder: response.firstName,
          formControlName: 'firstName',
          type: 'text',
          alert: '1 - 50 Characters, pretty please.',
          asyncAlert: '',
        }, {
          label: 'Last name',
          placeholder: response.lastName,
          formControlName: 'lastName',
          type: 'text',
          alert: '1 - 50 Characters, pretty please.',
          asyncAlert: '',
        }, {
          label: 'Username',
          placeholder: response.username,
          formControlName: 'username',
          type: 'text',
          alert: '3 - 50 Characters and no special characters, thanks!',
          asyncAlert: 'Username is already taken :(',
        }, {
          label: 'Email',
          placeholder: response.email,
          formControlName: 'email',
          type: 'text',
          alert: 'Not a valid e-mail address',
          asyncAlert: 'E-mail already exists, you\'re not new!',
        }, {
          label: 'Change password',
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
      ]);
    });
  }

  public toggleDisabled(disableEdit) {
    if (disableEdit) { this.userForm.enable(); this.disableButton = false; }
    if (!disableEdit) { this.userForm.disable(); this.disableButton = true; }
  }

  public confirmUpdate() {
    this.userService.login(true).then((isLoggedIn) => {
      if (!isLoggedIn) {
        this.slideToggle.toggle();
        return this.snackbarComponent.snackbarError('You\'re not who you say you are!');
      }
      const dialog = this.matDialog.open(DialogComponent, {
        data: {
          component: ConfirmDialogComponent,
          userFormFields: this.userFormFields,
          userForm: this.userForm
        }
      });
      dialog.afterClosed().subscribe((response) => {
        if (response === 'success') { this.getUserInfo(); }
      });
      this.slideToggle.toggle();
    });
  }

  public logout() {
    this.userService.logout();
  }

  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder,
    private matDialog: MatDialog,
    private snackbarComponent: SnackbarComponent,
  ) {
    this.userForm = this.validateForm();
    this.userForm.disable();
  }

  // Lifecycle
  ngOnInit() {
    this.getUserInfo();

    // Empty form validator
    this.userForm.valueChanges.subscribe(value => {
      if (Object.values(value).every(x => (x === null || x === ''))) { return this.userFormEmpty = true; }
      this.userFormEmpty = false;
    });
  }

  // Constructor methods
  private validateForm() {
    return this.formBuilder.group({
      firstName: [null, [
        Validators.minLength(1),
        Validators.maxLength(50)
      ]],

      lastName: [null, [
        Validators.minLength(1),
        Validators.maxLength(50),
      ]],

      username: [null, [
        usernameValidator({ noSpecialCharacters: true, minLength: 3, maxLength: 50 }),
      ], [
          usernameAsyncValidator({ debounceTime: 500, service: this.userService }),
        ]
      ],

      email: [null, [
        emailValidator()
      ], [
          emailAsyncValidator({ debounceTime: 500, service: this.userService }),
        ]
      ],

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
