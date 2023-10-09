import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { AppService } from '../app.service';
import { FooterComponent } from './footer/footer.component';
import { MatTabsModule } from '@angular/material/tabs';
import { routes } from '../app.routes';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FooterComponent,
    MatToolbarModule,
    MatSidenavModule,
    MatTabsModule,
  ],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent {
  public appName = this.app.title;
  public mobileQuery$ = this.breakpointObserver.observe(Breakpoints.XSmall);
  public routerLinks = routes.flatMap(({ path, data }) =>
    data?.['navTitle'] ? { path, data } : [],
  );

  constructor(
    private app: AppService,
    private breakpointObserver: BreakpointObserver,
  ) {}
}
