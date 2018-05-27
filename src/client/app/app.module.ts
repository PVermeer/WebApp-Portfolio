import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { ContactComponent } from './pages/contact/contact.component';
import { UserComponent } from './pages/user/user.component';

import { AppRoutingModule } from './app-routing.module';
import { UsersModule } from './_modules/users/users.module';
import { ContactModule } from './_modules/contact/contact.module';
import { SharedModule } from './_modules/_shared/shared.module';
import { ContentModule } from './_modules/content/content.module';

import { ErrorInterceptorProvider } from './error.interceptor';
import { SidenavService } from './sidenav/sidenav.service';
import { AdminComponent } from './pages/user/admin/admin.component';

@NgModule({
  declarations: [
    AppComponent,
    SidenavComponent,
    HomeComponent,
    AboutComponent,
    ContactComponent,
    UserComponent,
    AdminComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    ContactModule,
    UsersModule,
    ContentModule,
  ],
  providers: [ErrorInterceptorProvider, SidenavService],
  bootstrap: [AppComponent]
})
export class AppModule { }
