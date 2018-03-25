import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatDialogRef, DialogPosition, MAT_DIALOG_DATA, MatStepper } from '@angular/material';

import { UserService } from '../../../_services/user.service';
import { SnackbarComponent } from '../../../_components/snackbar/snackbar.component';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css'],
  providers: [UserService, MatStepper]
})
export class ConfirmDialogComponent implements OnInit {

  // Get elements
  @ViewChild('stepper') private stepper;

  // Variables
  public title = 'Change your details';
  public confirmForm: FormGroup;
  public progressBar = false;
  public confirmStep1 = 'Is it really you?';
  public confirmStep2 = 'Are you sure?';
  public userFormFields = this.data.userFormFields;
  public userForm: FormGroup = this.data.userForm;
  private dialogPosition: DialogPosition = { top: '150px' };

  // NgFor login input fields
  public confirmFormInputfields = [
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
  public updateUser(userForm) {
    this.progressBar = true;

    this.userService.updateUser(userForm).subscribe(response => {
      this.progressBar = false;

      if (response.error) {
        return this.snackbarComponent.snackbarError(response.error);
      }

      this.snackbarComponent.snackbarSucces(response.success);
      this.matDialog.close();
    },
      error => {
        this.progressBar = false;
      });
  }

  public confirm(loginForm) {
    this.progressBar = true;

    this.userService.loginUser(loginForm).subscribe(response => {
      this.progressBar = false;

      if (response.error) {
        return this.snackbarComponent.snackbarError(response.error);
      }

      this.confirmForm.controls['userValidator'].setErrors(null);
      this.stepper.next();
      this.snackbarComponent.snackbarSucces(response.success);
    },
      error => {
        this.progressBar = false;
      });
  }

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private snackbarComponent: SnackbarComponent,
    public matDialog: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private matStepper: MatStepper,
  ) { }

  // Lifecycle
  ngOnInit() {
    // Dialog options
    this.matDialog.updatePosition(this.dialogPosition);
    this.userForm.disable();

    // Form validation
    this.confirmForm = this.validateLogin();
  }

  // Constructor methods
  private validateLogin() {
    return this.formBuilder.group({
      email: ['henkie@henk.nl', [
        Validators.required,
        Validators.email,
      ]],
      password: ['password', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(50),
      ]],
      userValidator: [null, [ // Validated in confirm() method
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(4),
      ],
      ]
    });
  }

}
