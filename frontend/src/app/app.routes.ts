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
      },
      {
        path: 'tables',
        loadChildren: () =>
          import('./features/tables/tables.routes')
            .then(routes => routes.TABLES_ROUTES)
      },
      {
        path: 'orders',
        loadChildren: () =>
          import('./features/orders/orders.routes')
            .then(routes => routes.ORDERS_ROUTES)
      }
    ]
  },

];