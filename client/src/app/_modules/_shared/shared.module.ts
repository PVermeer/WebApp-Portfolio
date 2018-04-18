import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import './rxjs.module';
import { MaterialModule } from './material.module';
import { SnackbarComponent } from './snackbar/snackbar.component';
import { CssAnimateInviewService } from './css-animate-inview.service';
import { DialogModule } from './dialog/dialog.module';

const sharedModules = [
  HttpClientModule,
  MaterialModule,
  DialogModule,
  ];

@NgModule({
  declarations: [
    SnackbarComponent,
  ],
  imports: sharedModules,
  exports: sharedModules,
  providers: [
    SnackbarComponent, CssAnimateInviewService,
    ],
})
export class SharedModule { }
