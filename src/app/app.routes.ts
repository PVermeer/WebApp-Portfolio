import { Routes } from '@angular/router';
import { AppService } from './app.service';

export const routes: Routes = [
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
      import('./pages/home/home.component').then((mod) => mod.HomeComponent),
    title: `${AppService.Title} Second`,
    data: { navTitle: 'Second' },
  },
  { path: '**', redirectTo: 'home' },
];
