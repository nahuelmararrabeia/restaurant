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

@Component({
  selector: 'app-create-order',
  standalone: true,
  imports: [RouterLink, SubsectionHeader],
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
            'No se pudieron cargar las mesas disponibles.'
          );
        }
      });
  }

  selectTable(table: RestaurantTable): void {
    if (this.creating()) {
      return;
    }

    this.createError.set(null);
    this.selectedTableId.set(table.id);
  }

  isSelected(tableId: number): boolean {
    return this.selectedTableId() === tableId;
  }

  createOrder(): void {
    const tableId = this.selectedTableId();

    if (tableId === null || this.creating()) {
      return;
    }

    const request: CreateOrderRequest = {
      tableId
    };

    this.creating.set(true);
    this.createError.set(null);

    this.ordersApi
      .create(request)
      .pipe(
        finalize(() => this.creating.set(false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: order => {
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

            this.createError.set(
              'La mesa seleccionada ya no está disponible. Elegí otra mesa.'
            );

            return;
          }

          this.createError.set(
            'No se pudo crear la orden. Intentá nuevamente.'
          );
        }
      });
  }

  cancel(): void {
    void this.router.navigate(['/orders']);
  }
}