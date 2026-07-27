import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal
} from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';

import { TableForm } from '../../components/table-form/table-form';
import { CreateTableRequest } from '../../models/create-table-request';
import { TableFormValue } from '../../models/table-form-value';
import { TablesApi } from '../../services/tables-api';

@Component({
  selector: 'app-create-table',
  standalone: true,
  imports: [TableForm],
  templateUrl: './create-table.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateTable {
  private readonly tablesApi = inject(TablesApi);
  private readonly router = inject(Router);

  readonly saving = signal(false);
  readonly error = signal<string | null>(null);

  createTable(value: TableFormValue): void {
    if (this.saving()) {
      return;
    }

    const request: CreateTableRequest = {
      number: value.number,
      capacity: value.capacity
    };

    this.saving.set(true);
    this.error.set(null);

    this.tablesApi
      .create(request)
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: () => {
          void this.router.navigate(['/tables']);
        },
        error: () => {
          this.error.set(
            'No se pudo crear la mesa. Intentá nuevamente.'
          );
        }
      });
  }

  cancel(): void {
    void this.router.navigate(['/tables']);
  }
}