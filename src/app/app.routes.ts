import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/game/game.page').then(m => m.GamePage)
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];
