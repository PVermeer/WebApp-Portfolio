import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { DialogComponent } from './dialog.component';
import { MaterialModule } from '../material.module';
import { UserDialogComponent } from '../../users/user-dialog/user-dialog.component';

@NgModule({
  declarations: [
    DialogComponent,
  ],
  imports: [CommonModule, MaterialModule],
  providers: [],
  entryComponents: [
    DialogComponent, UserDialogComponent,
  ],
})
export class DialogModule { }
