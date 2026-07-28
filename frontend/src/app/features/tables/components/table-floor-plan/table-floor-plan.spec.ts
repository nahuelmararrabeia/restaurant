import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { TableFloorPlan } from './table-floor-plan';
import { RestaurantTable } from '../../../../shared/domain/tables/restaurant-table';

describe('TableFloorPlan', () => {
  const table: RestaurantTable = {
    id: 1,
    number: 1,
    capacity: 4,
    status: 'Available',
    activeOrderId: null,
    positionX: null,
    positionY: null,
    version: 7
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TableFloorPlan],
      providers: [provideRouter([])]
    });
  });

  it('uses default positions and toggles the action menu', () => {
    const fixture = TestBed.createComponent(TableFloorPlan);
    fixture.componentRef.setInput('tables', [table]);
    fixture.detectChanges();
    const component = fixture.componentInstance;

    expect(component.positionX(table, 0)).toBe(12);
    expect(component.positionY(table, 0)).toBe(18);
    component.toggleActions(table.id);
    expect(component.selectedTableId()).toBe(table.id);
    component.toggleActions(table.id);
    expect(component.selectedTableId()).toBeNull();
  });

  it('closes actions on a document click', () => {
    const fixture = TestBed.createComponent(TableFloorPlan);
    fixture.componentRef.setInput('tables', [table]);
    fixture.detectChanges();
    fixture.componentInstance.toggleActions(table.id);

    document.dispatchEvent(new MouseEvent('click'));

    expect(fixture.componentInstance.selectedTableId()).toBeNull();
  });

  it('emits clamped coordinates after dragging with the move handle', () => {
    const fixture = TestBed.createComponent(TableFloorPlan);
    fixture.componentRef.setInput('tables', [table]);
    fixture.detectChanges();
    const component = fixture.componentInstance;
    const positionChange = vi.fn();
    component.positionChange.subscribe(positionChange);
    const target = { setPointerCapture: vi.fn() };
    const down = {
      pointerId: 1,
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
      currentTarget: target
    } as unknown as PointerEvent;
    const floor = {
      getBoundingClientRect: () => ({
        left: 0,
        top: 0,
        width: 100,
        height: 100
      })
    } as HTMLElement;

    component.startDragging(down, table);
    component.finishDragging(
      { clientX: 110, clientY: -10 } as PointerEvent,
      table,
      floor
    );

    expect(positionChange).toHaveBeenCalledWith({
      table,
      positionX: 94,
      positionY: 6
    });
    expect(component.draggingTableId()).toBeNull();
  });
});
