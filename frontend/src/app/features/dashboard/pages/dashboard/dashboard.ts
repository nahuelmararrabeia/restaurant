import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { StatCard } from '../../../../shared/components/stat-card/stat-card';
import { APP_ICONS } from '../../../../shared/icons/icons';

@Component({
  selector: 'app-dashboard',
  imports: [StatCard],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dashboard {
  readonly statistics = signal([
        {
            title: 'Products',
            value: 24,
            icon: APP_ICONS.products
        },
        {
            title: 'Tables',
            value: 8,
            icon: APP_ICONS.tables
        },
        {
            title: 'Orders',
            value: 5,
            icon: APP_ICONS.orders
        },
        {
            title: 'Revenue',
            value: '$1,250',
            icon: APP_ICONS.revenue
        }
    ]);
}
