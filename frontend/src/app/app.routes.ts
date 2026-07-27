import { Routes } from '@angular/router';
import { Shell } from './core/layout/shell/shell';

export const routes: Routes = [
  {
    path: '',
    component: Shell,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/dashboard/pages/dashboard/dashboard')
            .then(c => c.Dashboard)
      },
      {
        path: 'products',
        loadChildren: () =>
          import('./features/products/products.routes')
            .then(routes => routes.PRODUCTS_ROUTES)
      }
    ]
  },

];