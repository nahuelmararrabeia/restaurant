import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input
} from '@angular/core';
import { OrderStatusBadge } from '../order-status-badge/order-status-badge';
import { Order } from '../../../../shared/domain/orders/order';
import { RouterLink } from '@angular/router';
import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'order-card',
  standalone: true,
  imports: [OrderStatusBadge, RouterLink, DatePipe, CurrencyPipe],
  templateUrl: './order-card.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderCard {
  readonly order = input.required<Order>();

  readonly totalUnits = computed(
    () => this.order().items.reduce(
      (total, item) => total + item.quantity,
      0
    )
  );
}
