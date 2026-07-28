import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { CreateOrder } from './create-order';
import { OrdersApi } from '../../services/orders-api';
import { TablesApi } from '../../../tables/services/tables-api';

describe('CreateOrder', () => {
  const table = {
    id: 1,
    number: 1,
    capacity: 4,
    status: 'Available' as const,
    activeOrderId: null,
    positionX: null,
    positionY: null,
    version: 7
  };
  const tablesApi = { getAvailable: vi.fn() };
  const ordersApi = { create: vi.fn() };
  const router = { navigate: vi.fn().mockResolvedValue(true) };

  beforeEach(() => {
    vi.clearAllMocks();
    TestBed.configureTestingModule({
      imports: [CreateOrder],
      providers: [
        { provide: TablesApi, useValue: tablesApi },
        { provide: OrdersApi, useValue: ordersApi },
        { provide: Router, useValue: router }
      ]
    });
  });

  function component(): CreateOrder {
    return TestBed.createComponent(CreateOrder).componentInstance;
  }

  it('loads and selects available tables', () => {
    tablesApi.getAvailable.mockReturnValue(of([table]));
    const create = component();
    create.loadTables();
    create.selectTable(table);
    expect(create.tables()).toEqual([table]);
    expect(create.selectedTable()).toEqual(table);
    expect(create.isSelected(1)).toBe(true);
  });

  it('reports table load errors', () => {
    tablesApi.getAvailable.mockReturnValue(throwError(() => new Error('network')));
    const create = component();
    create.loadTables();
    expect(create.loadError()).toContain('could not be loaded');
  });

  it('creates the order and navigates to its detail', () => {
    ordersApi.create.mockReturnValue(of({ id: 8 }));
    const create = component();
    create.tables.set([table]);
    create.selectedTableId.set(1);
    create.createOrder();
    expect(ordersApi.create).toHaveBeenCalledWith({
      tableId: 1,
      tableVersion: 7
    });
    expect(router.navigate).toHaveBeenCalledWith(['/orders', 8]);
  });

  it('removes a table that became unavailable', () => {
    ordersApi.create.mockReturnValue(throwError(() => new HttpErrorResponse({
      status: 409
    })));
    const create = component();
    create.tables.set([table]);
    create.selectedTableId.set(1);
    create.createOrder();
    expect(create.tables()).toEqual([]);
    expect(create.selectedTableId()).toBeNull();
    expect(create.createError()).toContain('no longer available');
  });

  it('does nothing without a selected table and supports cancel', () => {
    const create = component();
    create.createOrder();
    expect(ordersApi.create).not.toHaveBeenCalled();
    create.cancel();
    expect(router.navigate).toHaveBeenCalledWith(['/orders']);
  });
});
