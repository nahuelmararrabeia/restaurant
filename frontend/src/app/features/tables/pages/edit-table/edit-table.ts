import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';

import { RestaurantTable } from '../../../../shared/domain/tables/restaurant-table';
import { TableForm } from '../../components/table-form/table-form';
import { TableFormValue } from '../../models/table-form-value';
import { UpdateTableRequest } from '../../models/update-table-request';
import { TablesApi } from '../../services/tables-api';
import { HttpErrorResponse } from '@angular/common/http';
import { SubsectionHeader } from '../../../../shared/components/subsection-header/subsection-header';
import { LoadingState } from '../../../../shared/components/loading-state/loading-state';

@Component({
  selector: 'app-edit-table',
  standalone: true,
  imports: [TableForm, SubsectionHeader, LoadingState],
  templateUrl: './edit-table.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditTable implements OnInit {
  private readonly tablesApi = inject(TablesApi);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly table = signal<RestaurantTable | null>(null);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly loadError = signal<string | null>(null);
  readonly saveError = signal<string | null>(null);

  private tableId: number | null = null;

  ngOnInit(): void {
    this.loadTable();
  }

  updateTable(value: TableFormValue): void {
    if (this.tableId === null || this.saving()) {
      return;
    }

    const request: UpdateTableRequest = {
      number: value.number,
      capacity: value.capacity
    };

    this.saving.set(true);
    this.saveError.set(null);

    this.tablesApi
      .update(this.tableId, request)
      .pipe(
        finalize(() => this.saving.set(false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: () => {
          void this.router.navigate(['/tables']);
        },
        error: (error: HttpErrorResponse) => {
          if (error.status === 409) {
            this.saveError.set(
              'Ya existe otra mesa con ese número.'
            );
            return;
          }
          this.saveError.set(
            'No se pudo actualizar la mesa. Intentá nuevamente.'
          );
        }
      });
  }

  cancel(): void {
    void this.router.navigate(['/tables']);
  }

  retry(): void {
    this.loadTable();
  }

  private loadTable(): void {
    this.loading.set(true);
    this.loadError.set(null);
    this.table.set(null);
    this.tableId = null;

    const rawId = this.route.snapshot.paramMap.get('id');
    const id = Number(rawId);

    if (
      rawId === null ||
      !Number.isInteger(id) ||
      id <= 0
    ) {
      this.loadError.set(
        'El identificador de la mesa no es válido.'
      );
      this.loading.set(false);
      return;
    }

    this.tableId = id;

    this.tablesApi
      .getById(id)
      .pipe(
        finalize(() => this.loading.set(false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: table => {
          this.table.set(table);
        },
        error: () => {
          this.loadError.set(
            'No se pudo cargar la mesa.'
          );
        }
      });
  }
}