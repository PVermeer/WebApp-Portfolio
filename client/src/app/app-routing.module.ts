import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';

// Client routes from selector <router-outlet></router-outlet>
const routes: Routes = [
  { path: '', redirectTo: 'app', pathMatch: 'full' }, // Default route
  { path: 'app', component: AppComponent },
];
// use with <a routerLink="/ROUTE">someLink</a>

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
