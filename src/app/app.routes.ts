import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'map-screen',
    loadComponent: () => import('./maps/screens/map-screen/map-screen.component')

  },
  {
    path: '',
    redirectTo: 'map-screen',
    pathMatch: 'full'
  },
];
