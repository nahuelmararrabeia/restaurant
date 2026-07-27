import {
  ChangeDetectionStrategy,
  Component,
  input,
  output
} from '@angular/core';
import { DatePipe } from '@angular/common';

import { Order } from '../../../../shared/domain/orders/order';
import {
  OrderAction
} from '../../services/orders-service';

@Component({
  selector: 'order-status-card',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './order-status-card.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderStatusCard {
  readonly order = input.required<Order>();
  readonly canStartPreparing = input(false);
  readonly canMarkReady = input(false);
  readonly canDeliver = input(false);
  readonly canCancel = input(false);
  readonly runningAction = input<OrderAction | null>(null);

  readonly performAction = output<OrderAction>();
}
