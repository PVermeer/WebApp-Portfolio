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
import { LoginRegisterDialogComponent } from './_components/login-register-dialog/login-register-dialog.component';
import { SnackbarComponent } from './_components/snackbar/snackbar.component';

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
    LoginRegisterDialogComponent,
    SnackbarComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  entryComponents: [ContactDialogComponent, LoginRegisterDialogComponent],
  providers: [AuthGuard, JwtInterceptorProvider],
  bootstrap: [AppComponent]
})
export class AppModule { }
