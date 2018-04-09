import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../_shared/shared.module';
import { LoginComponent } from './user-dialog/login/login.component';
import { RegisterComponent } from './user-dialog/register/register.component';
import { UserDetailsComponent } from './user-details/user-details.component';
import { UserManagementComponent } from './admin/user-management/user-management.component';
import { ContentManagementComponent } from './admin/content-management/content-management.component';
import { UserManyDialogComponent } from './admin/user-management/many-dialog/user-many-dialog.component';
import { UserManyErrorDialogComponent } from './admin/user-management/many-dialog/user-many-error-dialog/user-many-error-dialog.component';
import {
  PasswordRecoveryDialogComponent
} from './user-dialog/password-recovery/password-recovery-dialog/password-recovery-dialog.component';
import { UpdatePasswordComponent } from './user-dialog/password-recovery/update-password.component';
import { VerifyUserComponent } from './user-dialog/verify-user/verify-user.component';
import { UserComponent } from './user.component';
import { UserDialogComponent } from './user-dialog/user-dialog.component';
import { ConfirmDialogComponent } from './user-details/confirm-dialog/confirm-dialog.component';
import { AdminComponent } from './admin/admin.component';
import { UserService } from './user.service';
import { AuthGuard } from './auth.guard';
import { JwtInterceptorProvider } from './jwt.interceptor';


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule
  ],
  declarations: [
    LoginComponent,
    RegisterComponent,
    UserDetailsComponent,
    UserManagementComponent,
    ContentManagementComponent,
    UserManyDialogComponent,
    UserManyErrorDialogComponent,
    PasswordRecoveryDialogComponent,
    UpdatePasswordComponent,
    VerifyUserComponent,
    UserComponent,
    UserDialogComponent,
    ConfirmDialogComponent,
    AdminComponent,
  ],
  providers: [UserService, AuthGuard, JwtInterceptorProvider],
  entryComponents: [
    UserDialogComponent, ConfirmDialogComponent,
    UserManyDialogComponent, PasswordRecoveryDialogComponent,
  ]
})
export class UsersModule { }
