import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'product-status-badge',
  standalone: true,
  imports: [],
  templateUrl: './product-status-badge.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductStatusBadge {
  readonly available = input.required<boolean>();
}
