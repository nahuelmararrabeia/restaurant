import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { DashboardTable } from '../../models/dashboard-table';

@Component({
  selector: 'table-status-grid',
  standalone: true,
  imports: [NgClass],
  templateUrl: './table-status-grid.html',
  styleUrl: './table-status-grid.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableStatusGrid {
  readonly tables = input.required<DashboardTable[]>();
}
