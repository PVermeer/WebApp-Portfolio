import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialModule } from '../material.module';
import { DialogComponent } from './dialog.component';

import { UserDialogComponent } from '../../users/user-dialog/user-dialog.component';
import {
  UserManyErrorDialogComponent
} from '../../users/admin/user-management/many-dialog/user-many-error-dialog/user-many-error-dialog.component';
import { UserManyDialogComponent } from '../../users/admin/user-management/many-dialog/user-many-dialog.component';
import { ConfirmDialogComponent } from '../../users/user-details/confirm-dialog/confirm-dialog.component';
import {
  PasswordRecoveryDialogComponent
} from '../../users/user-dialog/password-recovery/password-recovery-dialog/password-recovery-dialog.component';


@NgModule({
  declarations: [
    DialogComponent,
  ],
  imports: [CommonModule, MaterialModule],
  providers: [],
  entryComponents: [
    DialogComponent, UserDialogComponent, UserManyDialogComponent, UserManyErrorDialogComponent,
    ConfirmDialogComponent, PasswordRecoveryDialogComponent,
  ],
})
export class DialogModule { }
