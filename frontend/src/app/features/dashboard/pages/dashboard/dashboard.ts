import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  computed,
  inject,
  signal
} from '@angular/core';
import { Router } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';

import { StatCard } from '../../../../shared/components/stat-card/stat-card';
import { APP_ICONS } from '../../../../shared/icons/icons';
import { TableStatusGrid } from '../../components/table-status-grid/table-status-grid';
import { DashboardTable } from '../../models/dashboard-table';
import { RecentOrders } from '../../components/recent-orders/recent-orders';
import { RecentOrder } from '../../models/recent-order';
import { DashboardStatistics } from '../../models/dashboard-statistics';
import { DashboardApi } from '../../services/dashboard-api';
import { SectionHeader } from '../../../../shared/components/section-header/section-header';
import { LoadingState } from '../../../../shared/components/loading-state/loading-state';
import { ErrorState } from '../../../../shared/components/error-state/error-state';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    StatCard,
    TableStatusGrid,
    RecentOrders,
    SectionHeader,
    LoadingState,
    ErrorState
  ],
  providers: [CurrencyPipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Dashboard implements OnInit {
  private readonly dashboardApi = inject(DashboardApi);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);
  private readonly currencyPipe = inject(CurrencyPipe);

  readonly statisticsData =
    signal<DashboardStatistics | null>(null);

  readonly tables = signal<DashboardTable[]>([]);
  readonly recentOrders = signal<RecentOrder[]>([]);

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  readonly statistics = computed(() => {
    const statistics = this.statisticsData();

    if (!statistics) {
      return [];
    }

    return [
      {
        title: 'Products',
        value: statistics.products,
        icon: APP_ICONS.products,
        color: 'blue' as const
      },
      {
        title: 'Tables',
        value: statistics.tables,
        icon: APP_ICONS.tables,
        color: 'green' as const
      },
      {
        title: 'Active orders',
        value: statistics.activeOrders,
        icon: APP_ICONS.orders,
        color: 'amber' as const
      },
      {
        title: 'Today revenue',
        value: this.currencyPipe.transform(
            statistics.todayRevenue,
            'ARS',
            'symbol-narrow',
            '1.2-2',
            'es-AR'
        ) ?? '$0.00',
        // icon: APP_ICONS.revenue,
        // color: 'purple' as const
      }
    ];
  });

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    if (this.loading()) {
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    this.dashboardApi
      .get()
      .pipe(
        finalize(() => this.loading.set(false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: response => {
          this.statisticsData.set(response.statistics);
          this.tables.set(response.tables);
          this.recentOrders.set(response.recentOrders);
        },
        error: () => {
          this.error.set(
            'The dashboard information could not be loaded.'
          );
        }
      });
  }

  openOrder(orderId: number): void {
    void this.router.navigate([
      '/orders',
      orderId
    ]);
  }
}
