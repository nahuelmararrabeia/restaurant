import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { RestaurantTable } from '../../../../shared/domain/tables/restaurant-table';
import { TableStatusBadge } from '../../components/table-status-badge/table-status-badge';
import { TablesApi } from '../../services/tables-api';

@Component({
  selector: 'app-table-list',
  standalone: true,
  imports: [
    RouterLink,
    TableStatusBadge
  ],
  templateUrl: './table-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableList implements OnInit {
  private readonly tablesApi = inject(TablesApi);
  private readonly destroyRef = inject(DestroyRef);

  readonly tables = signal<RestaurantTable[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadTables();
  }

  loadTables(): void {
    this.loading.set(true);
    this.error.set(null);

    this.tablesApi
      .getAll()
      .pipe(
        finalize(() => this.loading.set(false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: tables => {
          this.tables.set(tables);
        },
        error: () => {
          this.error.set(
            'No se pudieron cargar las mesas.'
          );
        }
      });
  }
}