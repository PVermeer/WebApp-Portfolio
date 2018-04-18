import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './_modules/contact/contact.component';
import { UserComponent } from './_modules/users/user.component';
import { AuthGuard } from './_modules/users/auth.guard';
import { UpdatePasswordComponent } from './_modules/users/user-dialog/password-recovery/update-password.component';
import { VerifyUserComponent } from './_modules/users/user-dialog/verify-user/verify-user.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' }, // Default route
  { path: 'home', component: HomeComponent, data: { state: 'home'} },
  { path: 'about', component: AboutComponent, data: { state: 'about'} },
  { path: 'contact', component: ContactComponent, data: { state: 'contact'} },
  { path: 'user/verifyuser', component: VerifyUserComponent, data: { state: 'verifyuser'} },
  { path: 'user/updateuser', component: UpdatePasswordComponent, data: { state: 'updateuser'} },
  { path: 'user', component: UserComponent, data: { state: 'user'}, canActivate: [AuthGuard] },
  { path: '**', redirectTo: 'home', pathMatch: 'full' }, // All other routes
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
