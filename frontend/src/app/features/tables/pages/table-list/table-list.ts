import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal
} from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpErrorResponse } from '@angular/common/http';

import { RestaurantTable } from '../../../../shared/domain/tables/restaurant-table';
import { TablesApi } from '../../services/tables-api';
import { OrdersApi } from '../../../orders/services/orders-api';
import { SectionHeader } from '../../../../shared/components/section-header/section-header';
import { LoadingState } from '../../../../shared/components/loading-state/loading-state';
import { ErrorState } from '../../../../shared/components/error-state/error-state';
import { EmptyState } from '../../../../shared/components/empty-state/empty-state';
import { TableCard } from '../../components/table-card/table-card';

@Component({
  selector: 'app-table-list',
  standalone: true,
  imports: [
    TableCard,
    SectionHeader,
    LoadingState,
    ErrorState,
    EmptyState
  ],
  templateUrl: './table-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableList implements OnInit {
  private readonly tablesApi = inject(TablesApi);
  private readonly ordersApi = inject(OrdersApi);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly tables = signal<RestaurantTable[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  readonly actionInProgress = signal<number | null>(null);
  readonly actionError = signal<string | null>(null);

  ngOnInit(): void {
    this.loadTables();
  }

  loadTables(): void {
    this.loading.set(true);
    this.error.set(null);

    this.tablesApi
      .getAll()
      .pipe(
        finalize(() => this.loading.set(false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: tables => {
          this.tables.set(tables);
        },
        error: () => {
          this.error.set(
            'The tables could not be loaded.'
          );
        }
      });
  }

  createOrder(table: RestaurantTable): void {
    if (
      table.status !== 'Available' ||
      this.actionInProgress() !== null
    ) {
      return;
    }

    this.actionInProgress.set(table.id);
    this.actionError.set(null);

    this.ordersApi
      .create({ tableId: table.id })
      .pipe(
        finalize(() => this.actionInProgress.set(null)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: order => {
          void this.router.navigate(['/orders', order.id]);
        },
        error: (error: HttpErrorResponse) => {
          this.actionError.set(
            error.status === 409
              ? `Table ${table.number} is no longer available.`
              : `An order could not be created for table ${table.number}.`
          );

          if (error.status === 409) {
            this.loadTables();
          }
        }
      });
  }

  enableTable(table: RestaurantTable): void {
    if (this.actionInProgress() !== null) {
      return;
    }

    this.actionInProgress.set(table.id);
    this.actionError.set(null);

    this.tablesApi
      .enable(table.id)
      .pipe(
        finalize(() => this.actionInProgress.set(null)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: () => {
          this.tables.update(tables =>
            tables.map(currentTable =>
              currentTable.id === table.id
                ? {
                    ...currentTable,
                    status: 'Available'
                  }
                : currentTable
            )
          );
        },
        error: () => {
          this.actionError.set(
            `Table ${table.number} could not be enabled.`
          );
        }
      });
  }

  disableTable(table: RestaurantTable): void {
    if (this.actionInProgress() !== null) {
      return;
    }

    this.actionInProgress.set(table.id);
    this.actionError.set(null);

    this.tablesApi
      .disable(table.id)
      .pipe(
        finalize(() => this.actionInProgress.set(null)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: () => {
          this.tables.update(tables =>
            tables.map(currentTable =>
              currentTable.id === table.id
                ? {
                    ...currentTable,
                    status: 'Disabled'
                  }
                : currentTable
            )
          );
        },
        error: () => {
          this.actionError.set(
            `Table ${table.number} could not be disabled.`
          );
        }
      });
  }

  deleteTable(table: RestaurantTable): void {
    if (this.actionInProgress() !== null) {
      return;
    }

    if (!this.canDelete(table)) {
      this.actionError.set(
        `Table ${table.number} cannot be deleted while it is ${this.getStatusLabel(table)}.`
      );
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete table ${table.number}? This action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    this.actionInProgress.set(table.id);
    this.actionError.set(null);

    this.tablesApi
      .delete(table.id)
      .pipe(
        finalize(() => this.actionInProgress.set(null)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: () => {
          this.tables.update(tables =>
            tables.filter(currentTable => currentTable.id !== table.id)
          );
        },
        error: () => {
          this.actionError.set(
            `Table ${table.number} could not be deleted.`
          );
        }
      });
  }

  canDelete(table: RestaurantTable): boolean {
    return (
      table.status === 'Available' ||
      table.status === 'Disabled'
    );
  }

  private getStatusLabel(table: RestaurantTable): string {
    switch (table.status) {
      case 'Available':
        return 'available';

      case 'Occupied':
        return 'occupied';

      case 'Reserved':
        return 'reserved';

      case 'Disabled':
        return 'disabled';
    }
  }

  isActionInProgress(tableId: number): boolean {
    return this.actionInProgress() === tableId;
  }

  clearActionError(): void {
    this.actionError.set(null);
  }
}
