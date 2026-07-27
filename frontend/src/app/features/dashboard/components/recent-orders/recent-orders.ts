import { CurrencyPipe, DatePipe, NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { RecentOrder } from '../../models/recent-order';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'recent-orders',
  standalone: true,
  imports: [
    CurrencyPipe,
    DatePipe,
    NgClass,
    RouterLink
  ],
  templateUrl: './recent-orders.html',
  styleUrl: './recent-orders.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecentOrders {
  readonly orders = input.required<RecentOrder[]>();

  readonly orderSelected = output<number>();
}
