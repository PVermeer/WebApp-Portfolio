import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NewPageComponent } from '../content/content-management/new-page/new-page.component';
import { ConfirmDialogComponent } from '../users/user-details/confirm-dialog/confirm-dialog.component';
import { UserDialogComponent } from '../users/user-dialog/user-dialog.component';
import { UserManyDialogComponent } from '../users/user-management/many-dialog/user-many-dialog.component';
import { PasswordRecoveryDialogComponent } from '../users/verify-pages/password-recovery-dialog/password-recovery-dialog.component';
import { DialogSpinnerComponent, DialogSpinnerDialogComponent } from './components/dialog-spinner/dialog-spinner.component';
import { DialogComponent } from './components/dialog/dialog.component';
import { SnackbarComponent } from './components/snackbar/snackbar.component';
import { AnimateInviewDirective } from './directives/animate-inview.directive';
import { PagePathHighlightDirective } from './directives/page-path-highlight.directive';
import { PreviewImageDirective } from './directives/preview-image.directive';
import { ViewImageDirective } from './directives/view-image.directive';
import { MaterialModule } from './modules/material.module';
import { MaxLengthPipe } from './pipes/max-length.pipe';
import { MailService } from './services/mail.service';

const sharedModules = [
  CommonModule,
  MaterialModule,
  FormsModule,
  HttpClientModule,
  BrowserAnimationsModule,
];

@NgModule({
  imports: [
    sharedModules,
  ],
  declarations: [
    SnackbarComponent,
    DialogComponent,
    PreviewImageDirective,
    AnimateInviewDirective,
    ViewImageDirective,
    PagePathHighlightDirective,
    DialogSpinnerComponent,
    DialogSpinnerDialogComponent,
    MaxLengthPipe
  ],
  exports: [
    sharedModules,
    PreviewImageDirective,
    AnimateInviewDirective,
    ViewImageDirective,
    PagePathHighlightDirective,
    DialogSpinnerComponent,
    MaxLengthPipe
  ],
  providers: [
    SnackbarComponent, MailService
  ],
  entryComponents: [
    DialogComponent, UserDialogComponent, UserManyDialogComponent,
    ConfirmDialogComponent, PasswordRecoveryDialogComponent, NewPageComponent, DialogSpinnerDialogComponent
  ],

})
export class SharedModule { }
