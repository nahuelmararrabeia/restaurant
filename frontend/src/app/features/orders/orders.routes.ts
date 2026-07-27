import { Routes } from '@angular/router';

export const ORDERS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/order-list/order-list')
        .then(component => component.OrderList)
  },
  {
    path: 'new',
    loadComponent: () =>
      import('./pages/create-order/create-order')
        .then(component => component.CreateOrder)
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./pages/order-detail/order-detail')
        .then(component => component.OrderDetail)
  }
];