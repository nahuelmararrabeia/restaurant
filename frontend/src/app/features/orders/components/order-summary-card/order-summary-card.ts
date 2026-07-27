import {
  ChangeDetectionStrategy,
  Component,
  input
} from '@angular/core';
import { CurrencyPipe } from '@angular/common';

import { Order } from '../../../../shared/domain/orders/order';
import { OrderStatusBadge } from '../order-status-badge/order-status-badge';

@Component({
  selector: 'order-summary-card',
  standalone: true,
  imports: [CurrencyPipe, OrderStatusBadge],
  templateUrl: './order-summary-card.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderSummaryCard {
  readonly order = input.required<Order>();
  readonly totalUnits = input.required<number>();
}
