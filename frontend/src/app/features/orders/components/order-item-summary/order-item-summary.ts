import {
  ChangeDetectionStrategy,
  Component,
  input,
  output
} from '@angular/core';
import { CurrencyPipe } from '@angular/common';

import { OrderItem } from '../../../../shared/domain/orders/order-item';
import { OrderItemAction } from '../../services/orders-service';

@Component({
  selector: 'order-item-summary',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './order-item-summary.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderItemSummary {
  readonly item = input.required<OrderItem>();
  readonly canEdit = input(false);
  readonly busy = input(false);
  readonly runningAction = input<OrderItemAction | null>(null);

  readonly quantityChange = output<number>();
  readonly remove = output<void>();
}
