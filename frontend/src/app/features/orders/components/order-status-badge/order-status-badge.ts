import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input
} from '@angular/core';

import { OrderStatus } from '../../../../shared/domain/orders/order-status';

@Component({
  selector: 'order-status-badge',
  standalone: true,
  templateUrl: './order-status-badge.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderStatusBadge {
  readonly status = input.required<OrderStatus>();

  readonly label = computed(() => {
    switch (this.status()) {
      case 'Pending':
        return 'Draft';

      case 'Preparing':
        return 'Preparing';

      case 'Ready':
        return 'Ready';

      case 'Delivered':
        return 'Delivered';

      case 'Paid':
        return 'Paid';

      case 'Cancelled':
        return 'Cancelled';
    }
  });

  readonly badgeClass = computed(() => {
    switch (this.status()) {
      case 'Pending':
        return 'bg-slate-100 text-slate-700 ring-slate-200';

      case 'Preparing':
        return 'bg-amber-50 text-amber-700 ring-amber-200';

      case 'Ready':
        return 'bg-green-50 text-green-700 ring-green-200';

      case 'Delivered':
        return 'bg-violet-50 text-violet-700 ring-violet-200';

      case 'Paid':
        return 'bg-emerald-50 text-emerald-700 ring-emerald-200';

      case 'Cancelled':
        return 'bg-red-50 text-red-700 ring-red-200';
    }
  });
}
