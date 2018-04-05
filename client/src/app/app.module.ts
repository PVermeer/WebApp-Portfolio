import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { MaterialModule } from './_modules/material.module';
import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from './home/home.component';
import { SidenavComponent } from './_components/sidenav/sidenav.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { ContactDetailsComponent } from './contact/contact-details/contact-details.component';
import { ContactFormComponent } from './contact/contact-form/contact-form.component';
import { ContactDialogComponent } from './contact/contact-form/contact-dialog/contact-dialog.component';
import { UserComponent } from './user/user.component';
import { AuthGuard } from './_authentication/auth.guard';
import { JwtInterceptorProvider } from './_authentication/jwt.interceptor';
import { UserDialogComponent } from './_components/user-dialog/user-dialog.component';
import { SnackbarComponent } from './_components/snackbar/snackbar.component';
import { LoginComponent } from './_components/user-dialog/login/login.component';
import { RegisterComponent } from './_components/user-dialog/register/register.component';
import { UserDetailsComponent } from './user/user-details/user-details.component';
import { ErrorInterceptorProvider } from './_authentication/error.interceptor';
import { ConfirmDialogComponent } from './user/user-details/confirm-dialog/confirm-dialog.component';
import { UserService } from './_services/user.service';
import { SidenavService } from './_services/sidenav.service';
import { DialogComponent } from './_components/dialog/dialog.component';
import { AdminComponent } from './user/admin/admin.component';
import { UserManagementComponent } from './user/admin/user-management/user-management.component';
import { ContentManagementComponent } from './user/admin/content-management/content-management.component';
import { UserManyDialogComponent } from './user/admin/user-management/many-dialog/user-many-dialog.component';
import { UpdatePasswordComponent } from './_components/user-dialog/password-recovery/update-password.component';
import {
  PasswordRecoveryDialogComponent
} from './_components/user-dialog/password-recovery/password-recovery-dialog/password-recovery-dialog.component';
import { VerifyUserComponent } from './_components/user-dialog/verify-user/verify-user.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SidenavComponent,
    AboutComponent,
    ContactComponent,
    ContactDetailsComponent,
    ContactFormComponent,
    ContactDialogComponent,
    UserComponent,
    UserDialogComponent,
    SnackbarComponent,
    LoginComponent,
    RegisterComponent,
    UserDetailsComponent,
    ConfirmDialogComponent,
    DialogComponent,
    AdminComponent,
    UserManagementComponent,
    ContentManagementComponent,
    UserManyDialogComponent,
    PasswordRecoveryDialogComponent,
    UpdatePasswordComponent,
    VerifyUserComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  entryComponents: [
    ContactDialogComponent, UserDialogComponent, ConfirmDialogComponent, DialogComponent,
    UserManyDialogComponent, PasswordRecoveryDialogComponent,
  ],
  providers: [
    AuthGuard, JwtInterceptorProvider, ErrorInterceptorProvider, SnackbarComponent,
    UserService, SidenavService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
