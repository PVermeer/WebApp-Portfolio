import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule, RouterOutlet } from '@angular/router';
import { AppService } from '../app.service';
import { FooterComponent } from './footer/footer.component';
import { MatTabsModule } from '@angular/material/tabs';
import { routes } from '../app.routes';
import {
  animate,
  group,
  query,
  style,
  transition,
  trigger,
} from '@angular/animations';

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
  animations: [
    trigger('routerTransition', [
      transition('* <=> *', [
        query(':enter, :leave', style({ width: '100%', height: '100%' }), {
          optional: true,
        }),
        group([
          query(
            ':leave',
            [style({ opacity: 1 }), animate('150ms', style({ opacity: 0 }))],
            { optional: true },
          ),
          query(
            ':enter',
            [style({ opacity: 0 }), animate('150ms', style({ opacity: 1 }))],
            { optional: true },
          ),
        ]),
      ]),
    ]),
  ],
})
export class LayoutComponent {
  public appName = this.app.title;
  public mobileQuery$ = this.breakpointObserver.observe(Breakpoints.XSmall);
  public routerLinks = routes.flatMap(({ path, data }) =>
    data.navTitle ? { path, data } : [],
  );

  public getRouterState(outlet: RouterOutlet) {
    return outlet.activatedRouteData;
  }

  constructor(
    private app: AppService,
    private breakpointObserver: BreakpointObserver,
  ) {}
}
