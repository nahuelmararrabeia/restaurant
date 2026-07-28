import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  input,
  output,
  signal
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon } from '@ng-icons/core';

import { RestaurantTable } from '../../../../shared/domain/tables/restaurant-table';

export interface TablePositionChange {
  table: RestaurantTable;
  positionX: number;
  positionY: number;
}

interface Position {
  x: number;
  y: number;
}

@Component({
  selector: 'table-floor-plan',
  standalone: true,
  imports: [RouterLink, NgIcon],
  templateUrl: './table-floor-plan.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableFloorPlan {
  readonly tables = input.required<RestaurantTable[]>();
  readonly savingTableId = input<number | null>(null);
  readonly actionInProgressId = input<number | null>(null);

  readonly positionChange = output<TablePositionChange>();
  readonly createOrder = output<RestaurantTable>();
  readonly enableTable = output<RestaurantTable>();
  readonly disableTable = output<RestaurantTable>();
  readonly deleteTable = output<RestaurantTable>();

  readonly draggingTableId = signal<number | null>(null);
  readonly selectedTableId = signal<number | null>(null);
  private readonly draftPositions = signal<Record<number, Position>>({});

  toggleActions(tableId: number): void {
    if (this.draggingTableId() !== null) {
      return;
    }

    this.selectedTableId.update(selectedId =>
      selectedId === tableId ? null : tableId
    );
  }

  closeActions(): void {
    this.selectedTableId.set(null);
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.closeActions();
  }

  startDragging(
    event: PointerEvent,
    table: RestaurantTable
  ): void {
    if (this.savingTableId() !== null) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    (event.currentTarget as HTMLElement).setPointerCapture(
      event.pointerId
    );
    this.draggingTableId.set(table.id);
    this.selectedTableId.set(null);
  }

  drag(
    event: PointerEvent,
    table: RestaurantTable,
    floor: HTMLElement
  ): void {
    if (this.draggingTableId() !== table.id) {
      return;
    }

    const position = this.getPointerPosition(event, floor);

    this.draftPositions.update(positions => ({
      ...positions,
      [table.id]: position
    }));
  }

  finishDragging(
    event: PointerEvent,
    table: RestaurantTable,
    floor: HTMLElement
  ): void {
    if (this.draggingTableId() !== table.id) {
      return;
    }

    const position = this.getPointerPosition(event, floor);

    this.positionChange.emit({
      table,
      positionX: position.x,
      positionY: position.y
    });

    this.draftPositions.update(positions => {
      const next = { ...positions };
      delete next[table.id];
      return next;
    });
    this.draggingTableId.set(null);
  }

  cancelDragging(tableId: number): void {
    if (this.draggingTableId() !== tableId) {
      return;
    }

    this.draftPositions.update(positions => {
      const next = { ...positions };
      delete next[tableId];
      return next;
    });
    this.draggingTableId.set(null);
  }

  positionX(table: RestaurantTable, index: number): number {
    return this.draftPositions()[table.id]?.x
      ?? table.positionX
      ?? this.defaultPosition(index).x;
  }

  positionY(table: RestaurantTable, index: number): number {
    return this.draftPositions()[table.id]?.y
      ?? table.positionY
      ?? this.defaultPosition(index).y;
  }

  private getPointerPosition(
    event: PointerEvent,
    floor: HTMLElement
  ): Position {
    const bounds = floor.getBoundingClientRect();

    return {
      x: this.clamp(
        ((event.clientX - bounds.left) / bounds.width) * 100
      ),
      y: this.clamp(
        ((event.clientY - bounds.top) / bounds.height) * 100
      )
    };
  }

  private defaultPosition(index: number): Position {
    return {
      x: 12 + (index % 5) * 19,
      y: Math.min(18 + Math.floor(index / 5) * 24, 90)
    };
  }

  private clamp(value: number): number {
    return Math.round(
      Math.min(Math.max(value, 6), 94) * 100
    ) / 100;
  }
}
