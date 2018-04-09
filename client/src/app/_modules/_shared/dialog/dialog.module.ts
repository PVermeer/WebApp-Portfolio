import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { DialogComponent } from './dialog.component';
import { MaterialModule } from '../material.module';
import { UserDialogComponent } from '../../users/user-dialog/user-dialog.component';
import {
  UserManyErrorDialogComponent
} from '../../users/admin/user-management/many-dialog/user-many-error-dialog/user-many-error-dialog.component';

@NgModule({
  declarations: [
    DialogComponent,
  ],
  imports: [CommonModule, MaterialModule],
  providers: [],
  entryComponents: [
    DialogComponent, UserDialogComponent, UserManyErrorDialogComponent,
  ],
})
export class DialogModule { }
