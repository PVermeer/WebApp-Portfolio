import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { LoginComponent } from './login/login.component';
import { UserComponent } from './user/user.component';
import { AuthGuard } from './_authentication/auth.guard';

// Client routes from selector <router-outlet></router-outlet>
const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' }, // Default route
  { path: 'home', component: HomeComponent, data: { state: 'home'} },
  { path: 'about', component: AboutComponent, data: { state: 'about'} },
  { path: 'login', component: LoginComponent, data: { state: 'login'} },
  { path: 'user', component: UserComponent, data: { state: 'user'}, canActivate: [AuthGuard] },
  { path: '**', redirectTo: 'home', pathMatch: 'full' }, // All other routes
];
// use with <a routerLink="/ROUTE">someLink</a>

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
