import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserRegister } from '../../../../../../server/database/models/users/user.types';
import { DialogComponent, DialogContent } from '../../../_shared/components/dialog/dialog.component';
import { SnackbarComponent } from '../../../_shared/components/snackbar/snackbar.component';
import { UserService } from '../.././user.service';
import { AppValidators } from '../../custom.validators';

@Component({
  selector: 'app-password-recovery-dialog',
  templateUrl: './password-recovery-dialog.component.html',
  styleUrls: ['./password-recovery-dialog.component.css'],
})
export class PasswordRecoveryDialogComponent implements OnInit, OnDestroy {

  // Variables
  private token: string;
  public title = 'Enter new password';
  public progressBar = false;
  public userForm: FormGroup;
  public userFormEmpty = true;

  private subscriptions = new Subscription;

  // NgFor fields
  public userFormFields = [
    {
      label: 'New password',
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
  ];

  // Methods
  public updatePassword(userForm: UserRegister) {
    this.progressBar = true;

    // Update the password with token
    this.userService.updateUserPassword(userForm, this.token).subscribe(response => {
      this.progressBar = false;

      this.snackbarComponent.snackbarSuccess(response);
      this.dialogComponent.matDialog.close();
      this.router.navigate(['/user']);

      // Catch errors
    }, (error) => {
      this.progressBar = false;

      // Open error dialog
      const data: DialogContent = { dialogData: { title: 'Oops..', body: error.message, button: 'Okay', }, };
      this.matDialog.open(DialogComponent, { data });
    });
  }

  // Form validation
  private validateForm() {
    return this.formBuilder.group({
      password: [null, [
        AppValidators.matchPattern({ minLength: 8, maxLength: 50 }),
      ]],

      passwordConfirm: [null, [
        AppValidators.matchControl('password'),
      ]],
    });
  }

  // Life cycle
  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder,
    private snackbarComponent: SnackbarComponent,
    private router: Router,
    private dialogComponent: DialogComponent,
    private matDialog: MatDialog,
  ) {
    // Form validation
    this.userForm = this.validateForm();

    // Get token from parent
    this.token = dialogComponent.data.token;
  }

  ngOnInit() {
    // Empty form validator
    const subscription = this.userForm.valueChanges.subscribe(value => {
      if (Object.values(value).every(x => (x === null || x === ''))) { return this.userFormEmpty = true; }
      return this.userFormEmpty = false;
    });
    this.subscriptions.add(subscription);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

}
