import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './_modules/users/auth.guard';
import { VerifyUserComponent } from './_modules/users/user-dialog/verify-user/verify-user.component';
import { EmailUpdateComponent } from './_modules/users/verify-pages/email-update.component';
import { UpdatePasswordComponent } from './_modules/users/verify-pages/update-password.component';
import { AboutComponent } from './pages/about/about.component';
import { ContactComponent } from './pages/contact/contact.component';
import { ErrorComponent } from './pages/error/error.component';
import { HomeComponent } from './pages/home/home.component';
import { PageResolver } from './pages/page-resolver.service';
import { UserComponent } from './pages/user/user.component';

const routes: Routes = [
  // Verification routes
  { path: 'user/verifyuser', component: VerifyUserComponent, data: { state: 'verifyuser' } },
  { path: 'user/updateuser', component: UpdatePasswordComponent, data: { state: 'updateuser' } },
  { path: 'user/verifyEmail', component: EmailUpdateComponent, data: { state: 'emailupdate' } },

  // Page routes
  { path: '', redirectTo: 'home', pathMatch: 'full' }, // Default route
  { path: 'home', component: HomeComponent, data: { state: 'home' }, resolve: { page: PageResolver } },
  { path: 'about', component: AboutComponent, data: { state: 'about' }, resolve: { page: PageResolver } },
  { path: 'contact', component: ContactComponent, data: { state: 'contact' }, resolve: { page: PageResolver } },
  { path: 'user', component: UserComponent, data: { state: 'user' }, canActivate: [AuthGuard] },
  { path: 'error', component: ErrorComponent, data: { state: 'error' } },
  { path: '**', redirectTo: 'home', pathMatch: 'full' }, // All other routes
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
