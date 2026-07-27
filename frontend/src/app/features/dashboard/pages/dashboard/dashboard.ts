import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { StatCard } from '../../../../shared/components/stat-card/stat-card';
import { APP_ICONS } from '../../../../shared/icons/icons';
import { TableStatusGrid } from '../../components/table-status-grid/table-status-grid';
import { DashboardTable } from '../../models/dashboard-table';
import { RecentOrders } from '../../components/recent-orders/recent-orders';
import { RecentOrder } from '../../models/recent-order';

@Component({
  selector: 'app-dashboard',
  imports: [StatCard, TableStatusGrid, RecentOrders],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dashboard {
  readonly statistics = signal([
        {
            title: 'Products',
            value: 24,
            icon: APP_ICONS.products,
            color: 'blue'
        },
        {
            title: 'Tables',
            value: 8,
            icon: APP_ICONS.tables,
            color: 'green'
        },
        {
            title: 'Orders',
            value: 5,
            icon: APP_ICONS.orders,
            color: 'amber'
        },
        {
            title: 'Revenue',
            value: '$1,250',
            icon: APP_ICONS.revenue,
            color: 'purple'
        }
    ]);

    readonly tables = signal<DashboardTable[]>([
    {
        id: 1,
        number: 1,
        capacity: 4,
        status: 'available'
    },
    {
        id: 2,
        number: 2,
        capacity: 2,
        status: 'occupied'
    },
    {
        id: 3,
        number: 3,
        capacity: 6,
        status: 'reserved'
    },
    {
        id: 4,
        number: 4,
        capacity: 4,
        status: 'disabled'
    },
    {
        id: 5,
        number: 5,
        capacity: 4,
        status: 'available'
    },
    {
        id: 6,
        number: 6,
        capacity: 2,
        status: 'available'
    }
    ]);

    readonly recentOrders = signal<RecentOrder[]>([
    {
        id: 105,
        tableNumber: 3,
        status: 'preparing',
        total: 48.5,
        orderedAt: new Date()
    },
    {
        id: 104,
        tableNumber: 5,
        status: 'ready',
        total: 32,
        orderedAt: new Date(Date.now() - 12 * 60 * 1000)
    },
    {
        id: 103,
        tableNumber: 1,
        status: 'pending',
        total: 21.75,
        orderedAt: new Date(Date.now() - 25 * 60 * 1000)
    },
    {
        id: 102,
        tableNumber: 7,
        status: 'delivered',
        total: 65.2,
        orderedAt: new Date(Date.now() - 45 * 60 * 1000)
    }
    ]);

    openOrder(orderId: number): void {
       console.log('Selected order:', orderId);
    }
}
