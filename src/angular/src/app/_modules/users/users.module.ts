import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../_shared/shared.module';
import { LoginComponent } from './user-dialog/login/login.component';
import { RegisterComponent } from './user-dialog/register/register.component';
import { UserDetailsComponent } from './user-details/user-details.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { UserManyDialogComponent } from './user-management/many-dialog/user-many-dialog.component';
import {
  PasswordRecoveryDialogComponent
} from './verify-pages/password-recovery-dialog/password-recovery-dialog.component';
import { UpdatePasswordComponent } from './verify-pages/update-password.component';
import { VerifyUserComponent } from './user-dialog/verify-user/verify-user.component';
import { UserDialogComponent } from './user-dialog/user-dialog.component';
import { ConfirmDialogComponent } from './user-details/confirm-dialog/confirm-dialog.component';
import { UserService } from './user.service';
import { AuthGuard } from './auth.guard';
import { JwtInterceptorProvider } from './jwt.interceptor';
import { EmailUpdateComponent } from './verify-pages/email-update.component';


@NgModule({
  imports: [
    SharedModule,
    ReactiveFormsModule
  ],
  declarations: [
    LoginComponent,
    RegisterComponent,
    UserDetailsComponent,
    UserManagementComponent,
    UserManyDialogComponent,
    PasswordRecoveryDialogComponent,
    UpdatePasswordComponent,
    VerifyUserComponent,
    UserDialogComponent,
    ConfirmDialogComponent,
    EmailUpdateComponent,
  ],
  exports: [
    UserDetailsComponent,
    UserManagementComponent,
 ],
  providers: [UserService, AuthGuard, JwtInterceptorProvider],
})
export class UsersModule { }
