import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  inject,
  signal
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';

import { Order } from '../../../../shared/domain/orders/order';
import { OrdersApi } from '../../services/orders-api';
import { SectionHeader } from '../../../../shared/components/section-header/section-header';
import { OrderCard } from '../../components/order-card/order-card';
import { LoadingState } from '../../../../shared/components/loading-state/loading-state';
import { ErrorState } from '../../../../shared/components/error-state/error-state';
import { EmptyState } from '../../../../shared/components/empty-state/empty-state';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [
    OrderCard,
    SectionHeader,
    LoadingState,
    ErrorState,
    EmptyState
  ],
  templateUrl: './order-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderList implements OnInit {
  private readonly ordersApi = inject(OrdersApi);
  private readonly destroyRef = inject(DestroyRef);

  readonly orders = signal<Order[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly page = signal(1);
  readonly pageSize = 9;
  readonly totalCount = signal(0);
  readonly totalPages = signal(0);

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    if (this.loading()) {
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    this.ordersApi
      .getAll(this.page(), this.pageSize)
      .pipe(
        finalize(() => this.loading.set(false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: response => {
          this.orders.set(response.items);
          this.page.set(response.page);
          this.totalCount.set(response.totalCount);
          this.totalPages.set(response.totalPages);
        },
        error: () => {
          this.error.set(
            'The active orders could not be loaded.'
          );
        }
      });
  }

  goToPage(page: number): void {
    if (
      this.loading() ||
      page < 1 ||
      page > this.totalPages() ||
      page === this.page()
    ) {
      return;
    }

    this.page.set(page);
    this.loadOrders();
  }
}
