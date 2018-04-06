import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';

import { AppRoutingModule } from './app-routing.module';
import { UsersModule } from './_modules/users/users.module';
import { ContactModule } from './_modules/contact/contact.module';
import { SharedModule } from './_modules/_shared/shared.module';
import { ErrorInterceptor } from './error.interceptor';
import { SidenavService } from './sidenav/sidenav.service';

@NgModule({
  declarations: [
    AppComponent,
    SidenavComponent,
    HomeComponent,
    AboutComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    SharedModule,
    ContactModule,
    UsersModule,
  ],
  providers: [ErrorInterceptor, SidenavService],
  bootstrap: [AppComponent]
})
export class AppModule { }
