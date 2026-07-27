import { Routes } from '@angular/router';

export const TABLES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/table-list/table-list')
        .then(component => component.TableList)
  },
  {
    path: 'new',
    loadComponent: () =>
      import('./pages/create-table/create-table')
        .then(component => component.CreateTable)
  },
  {
    path: ':id/edit',
    loadComponent: () =>
      import('./pages/edit-table/edit-table')
        .then(component => component.EditTable)
  }
];