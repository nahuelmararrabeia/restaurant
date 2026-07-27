import { Routes } from '@angular/router';

export const TABLES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/table-list/table-list')
        .then(component => component.TableList)
  }
];