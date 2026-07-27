import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input
} from '@angular/core';

import { TableStatus } from '../../../../shared/domain/tables/table-status';

@Component({
  selector: 'table-status-badge',
  standalone: true,
  templateUrl: './table-status-badge.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableStatusBadge {
  readonly status = input.required<TableStatus>();

  readonly label = computed(() => {
    switch (this.status()) {
      case 'Available':
        return 'Available';

      case 'Occupied':
        return 'Occupied';

      case 'Reserved':
        return 'Reserved';

      case 'Disabled':
        return 'Disabled';
    }
  });

  readonly badgeClass = computed(() => {
    switch (this.status()) {
      case 'Available':
        return 'bg-green-100 text-green-700';

      case 'Occupied':
        return 'bg-red-100 text-red-700';

      case 'Reserved':
        return 'bg-amber-100 text-amber-700';

      case 'Disabled':
        return 'bg-slate-100 text-slate-600';
    }
  });
}
