import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  computed,
  inject,
  signal
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { RestaurantTable } from '../../../../shared/domain/tables/restaurant-table';
import { TablesApi } from '../../../tables/services/tables-api';
import { CreateOrderRequest } from '../../models/create-order-request';
import { OrdersApi } from '../../services/orders-api';
import { HttpErrorResponse } from '@angular/common/http';
import { SubsectionHeader } from '../../../../shared/components/subsection-header/subsection-header';
import { ErrorState } from '../../../../shared/components/error-state/error-state';
import { LoadingState } from '../../../../shared/components/loading-state/loading-state';
import { NgIcon } from '@ng-icons/core';
import { createIdempotencyKey } from '../../../../shared/utils/idempotency-key';

@Component({
  selector: 'app-create-order',
  standalone: true,
  imports: [
    RouterLink,
    SubsectionHeader,
    ErrorState,
    LoadingState,
    NgIcon
  ],
  templateUrl: './create-order.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateOrder implements OnInit {
  private readonly tablesApi = inject(TablesApi);
  private readonly ordersApi = inject(OrdersApi);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly tables = signal<RestaurantTable[]>([]);
  readonly selectedTableId = signal<number | null>(null);

  readonly loading = signal(false);
  readonly creating = signal(false);

  readonly loadError = signal<string | null>(null);
  readonly createError = signal<string | null>(null);
  private idempotencyKey: string | null = null;

  readonly selectedTable = computed(() => {
    const tableId = this.selectedTableId();

    if (tableId === null) {
      return null;
    }

    return (
      this.tables().find(table => table.id === tableId) ??
      null
    );
  });

  ngOnInit(): void {
    this.loadTables();
  }

  loadTables(): void {
    if (this.loading()) {
      return;
    }

    this.loading.set(true);
    this.loadError.set(null);
    this.tables.set([]);
    this.selectedTableId.set(null);

    this.tablesApi
      .getAvailable()
      .pipe(
        finalize(() => this.loading.set(false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: tables => {
          this.tables.set(tables);
        },
        error: () => {
          this.loadError.set(
            'The available tables could not be loaded.'
          );
        }
      });
  }

  selectTable(table: RestaurantTable): void {
    if (this.creating()) {
      return;
    }

    this.createError.set(null);
    if (this.selectedTableId() !== table.id) {
      this.idempotencyKey = null;
    }
    this.selectedTableId.set(table.id);
  }

  isSelected(tableId: number): boolean {
    return this.selectedTableId() === tableId;
  }

  createOrder(): void {
    const tableId = this.selectedTableId();
    const table = this.selectedTable();

    if (tableId === null || table === null || this.creating()) {
      return;
    }

    const request: CreateOrderRequest = {
      tableId,
      tableVersion: table.version
    };

    this.creating.set(true);
    this.createError.set(null);
    this.idempotencyKey ??= createIdempotencyKey();

    this.ordersApi
      .create(request, this.idempotencyKey)
      .pipe(
        finalize(() => this.creating.set(false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: order => {
          this.idempotencyKey = null;
          void this.router.navigate([
            '/orders',
            order.id
          ]);
        },
        error: (error: HttpErrorResponse) => {
          if (error.status === 409) {
            this.tables.update(tables =>
              tables.filter(table => table.id !== tableId)
            );

            this.selectedTableId.set(null);
            this.idempotencyKey = null;

            this.createError.set(
              'The selected table is no longer available. Choose another table.'
            );

            return;
          }

          this.createError.set(
            'The order could not be created. Please try again.'
          );
        }
      });
  }

  cancel(): void {
    void this.router.navigate(['/orders']);
  }
}
