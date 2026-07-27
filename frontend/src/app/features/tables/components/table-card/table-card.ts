import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { TableStatusBadge } from '../table-status-badge/table-status-badge';
import { RestaurantTable } from '../../../../shared/domain/tables/restaurant-table';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'table-card',
  standalone: true,
  imports: [TableStatusBadge, RouterLink],
  templateUrl: './table-card.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableCard {
  readonly table = input.required<RestaurantTable>();
  readonly canDelete = input.required<boolean>();
  readonly isActionInProgress = input.required<boolean>();
  readonly onClickDelete = output<void>();
  readonly onClickEnable = output<void>();
  readonly onClickDisable = output<void>();
}
