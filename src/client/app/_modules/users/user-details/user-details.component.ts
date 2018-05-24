import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatSlideToggle } from '@angular/material';
import { Observable, Subscription, of } from 'rxjs';
import { UserModel } from '../../../../../server/database/models/users/user.types';
import { DialogComponent, DialogContent } from '../../_shared/components/dialog/dialog.component';
import { SnackbarComponent } from '../../_shared/components/snackbar/snackbar.component';
import { UserService } from '.././user.service';
import { AppValidators } from '../custom.validators';
import { CurrentUser } from '../jwt.interceptor';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css'],
})
export class UserDetailsComponent implements OnInit, OnDestroy {

  // Get elements
  @ViewChild('slideToggle') private slideToggle: MatSlideToggle;
  @ViewChild('slideToggleDelete') private slideToggleDelete: MatSlideToggle;

  // Variables
  public userTitle = 'User details';
  public progressBar = false;
  public userForm: FormGroup;
  public disableEdit: boolean;
  public userFormFields: Observable<Array<any>>;
  public disableButton = true;
  public userFormEmpty = true;
  private user: UserModel;

  private subscription = new Subscription;

  // Methods
  private getUserInfo = () => {

    // NgFor input fields (async) with current values
    this.userService.userInfo().subscribe((response) => {
      this.user = response;

      this.userFormFields = of([
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
    }, () => { }
    );
  }

  public toggleDisabled(disableEdit: MatSlideToggle) {

    // Toggle access to the form
    if (disableEdit) { this.userForm.enable(); this.disableButton = false; }
    if (!disableEdit) { this.userForm.disable(); this.disableButton = true; }
  }

  public async confirmUpdate() {

    // User must login again
    const username = this.user.email;
    const isLoggedIn = await this.userService.login(true, username);

    // Stop if not logged in
    if (!isLoggedIn) {
      this.slideToggle.toggle();
      return this.snackbarComponent.snackbarError('You\'re not logged in');
    }

    // On success open dialog to confirm the form
    this.userForm.disable();
    this.userForm.setErrors(null);

    const data: DialogContent = {
      component: ConfirmDialogComponent, userFormFields: this.userFormFields, userForm: this.userForm
    };
    const dialog = this.matDialog.open(DialogComponent, { data });

    // On success close dialog and get new user details
    dialog.afterClosed().subscribe((response) => {
      if (response === 'success') { this.getUserInfo(); }
      this.slideToggle.toggle();
    });
  }

  public async deleteAccount() {

    // User must login again
    const username = this.user.email;
    const isLoggedIn = await this.userService.login(true, username);

    // Stop if not logged in
    if (!isLoggedIn) {
      this.slideToggleDelete.toggle();
      return this.snackbarComponent.snackbarError('You\'re not logged in');
    }

    // On success open dialog to confirm the form
    const data: DialogContent = {
      dialogData: {
        title: 'Delete your account',
        body: 'Are you sure you want to <b>delete</b> your account?',
        button: 'Yes I\'m sure'
      }
    };
    const dialog = this.matDialog.open(DialogComponent, { data });

    // On success close dialog and redirect to the home page
    dialog.afterClosed().subscribe((response: boolean) => {

      this.slideToggleDelete.toggle();
      if (response) {
        const currentUser: CurrentUser = JSON.parse(localStorage.getItem('currentUser'));
        const { _id } = currentUser.payload;

        this.userService.deleteUser(_id).subscribe(res => {

          this.logout();
          this.snackbarComponent.snackbarSuccess(res);

          // Catch errors
        }, (error) => {
          this.snackbarComponent.snackbarError(error.message);
        }
        );
      }
    });
  }

  public logout() { this.userService.logout(); }

  private validateForm() {
    return this.formBuilder.group({
      firstName: [null,
        [Validators.minLength(1), Validators.maxLength(50)]
      ],

      lastName: [null,
        [Validators.minLength(1), Validators.maxLength(50)]
      ],

      username: [null,
        [AppValidators.matchPattern({ noSpecialCharacters: true, minLength: 3, maxLength: 50 })],
        [AppValidators.usernameAsync(this.userService)]
      ],

      email: [null,
        [Validators.email],
        [AppValidators.emailAsync(this.userService)]
      ],

      password: [null,
        [AppValidators.matchPattern({ minLength: 8, maxLength: 50 })]
      ],

      passwordConfirm: [null,
        [AppValidators.matchControl('password')]
      ],
    });
  }

  private extraFormValidation() {
    const subscription = this.userForm.valueChanges.subscribe(value => {

      if (this.userForm.get('password').value !== this.userForm.get('passwordConfirm').value) {
        this.userFormEmpty = true;
        return;
      }
      if (Object.values(value).every(x => (x === null || x === ''))) { this.userFormEmpty = true; return; }

      this.userFormEmpty = false;
    });
    this.subscription.add(subscription);
  }

  // Life cycle
  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder,
    private matDialog: MatDialog,
    private snackbarComponent: SnackbarComponent,
  ) {
    // Form validation
    this.userForm = this.validateForm();

    // Disable form at start
    this.userForm.disable();
  }

  ngOnInit() {
    // Get user info at start
    this.getUserInfo();
    // Extra form validation
    this.extraFormValidation();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
