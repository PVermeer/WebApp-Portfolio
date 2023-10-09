import { Route } from '@angular/router';
import { AppService } from './app.service';

interface PageRoute extends Route {
  data: { navTitle: string | undefined };
}

export const routes: PageRoute[] = [
  {
    path: 'home',
    loadComponent: () =>
      import('./pages/home/home.component').then((mod) => mod.HomeComponent),
    title: `${AppService.Title} Home`,
    data: { navTitle: 'Home' },
  },
  {
    path: 'second',
    loadComponent: () =>
      import('./layout/layout.component').then((mod) => mod.LayoutComponent),
    title: `${AppService.Title} Second`,
    data: { navTitle: 'Second' },
  },
  { path: '**', redirectTo: 'home', data: { navTitle: undefined } },
];
