import { Routes } from '@angular/router';

export const PRODUCTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/product-list/product-list')
        .then(component => component.ProductList)
  },
  {
    path: 'new',
    loadComponent: () =>
      import('./pages/create-product/create-product')
        .then(component => component.CreateProduct)
  },
  {
    path: ':id/edit',
    loadComponent: () =>
      import('./pages/edit-product/edit-product')
        .then(component => component.EditProduct)
  }
];