import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ErrorInterceptorProvider } from './error.interceptor';
import { AboutComponent } from './pages/about/about.component';
import { ContactComponent } from './pages/contact/contact.component';
import { ErrorComponent } from './pages/error/error.component';
import { HomeComponent } from './pages/home/home.component';
import { PageResolver } from './pages/page-resolver.service';
import { UserComponent } from './pages/user/user.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { SidenavService } from './sidenav/sidenav.service';
import { ContactModule } from './_modules/contact/contact.module';
import { ContentModule } from './_modules/content/content.module';
import { UsersModule } from './_modules/users/users.module';
import { SharedModule } from './_modules/_shared/shared.module';
import { VisualModule } from './_modules/_visual/visual.module';

@NgModule({
  declarations: [
    AppComponent,
    SidenavComponent,
    HomeComponent,
    AboutComponent,
    ContactComponent,
    UserComponent,
    ErrorComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    ContactModule,
    UsersModule,
    ContentModule,
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production }),
    VisualModule,
  ],
  providers: [ErrorInterceptorProvider, SidenavService, PageResolver],
  bootstrap: [AppComponent]
})
export class AppModule { }
