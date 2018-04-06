import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialModule } from './material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SnackbarComponent } from './snackbar/snackbar.component';
import { DialogComponent } from './dialog/dialog.component';
import { SidenavService } from '../../sidenav/sidenav.service';
import { CssAnimateInviewService } from './css-animate-inview.service';

const sharedModules = [
  MaterialModule,
  ReactiveFormsModule,
  ];

@NgModule({
  declarations: [
    SnackbarComponent,
    DialogComponent,
  ],
  imports: sharedModules,
  exports: sharedModules,
  providers: [
    SnackbarComponent, SidenavService, CssAnimateInviewService,
    ],
  entryComponents: [DialogComponent],
})
export class SharedModule { }
