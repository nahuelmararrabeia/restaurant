import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { TableList } from './table-list';
import { TablesApi } from '../../services/tables-api';
import { OrdersApi } from '../../../orders/services/orders-api';
import { RestaurantTable } from '../../../../shared/domain/tables/restaurant-table';

describe('TableList', () => {
  const table: RestaurantTable = {
    id: 1,
    number: 1,
    capacity: 4,
    status: 'Available',
    activeOrderId: null,
    positionX: 10,
    positionY: 20
  };
  const tablesApi = {
    getAll: vi.fn(),
    updatePosition: vi.fn(),
    enable: vi.fn(),
    disable: vi.fn(),
    delete: vi.fn()
  };
  const ordersApi = { create: vi.fn() };
  const router = { navigate: vi.fn().mockResolvedValue(true) };

  beforeEach(() => {
    vi.clearAllMocks();
    TestBed.configureTestingModule({
      imports: [TableList],
      providers: [
        { provide: TablesApi, useValue: tablesApi },
        { provide: OrdersApi, useValue: ordersApi },
        { provide: Router, useValue: router }
      ]
    });
  });

  function component(): TableList {
    return TestBed.createComponent(TableList).componentInstance;
  }

  it('loads tables', () => {
    tablesApi.getAll.mockReturnValue(of([table]));
    const list = component();
    list.loadTables();

    expect(list.tables()).toEqual([table]);
    expect(list.loading()).toBe(false);
  });

  it('creates an order for an available table', () => {
    ordersApi.create.mockReturnValue(of({ id: 9 }));
    const list = component();
    list.createOrder(table);

    expect(ordersApi.create).toHaveBeenCalledWith({ tableId: 1 });
    expect(router.navigate).toHaveBeenCalledWith(['/orders', 9]);
  });

  it('does not create an order for a disabled table', () => {
    const list = component();
    list.createOrder({ ...table, status: 'Disabled' });
    expect(ordersApi.create).not.toHaveBeenCalled();
  });

  it('updates and persists the table position optimistically', () => {
    tablesApi.updatePosition.mockReturnValue(of(undefined));
    const list = component();
    list.tables.set([table]);

    list.updateTablePosition({
      table,
      positionX: 40,
      positionY: 60
    });

    expect(tablesApi.updatePosition).toHaveBeenCalledWith(1, {
      positionX: 40,
      positionY: 60
    });
    expect(list.tables()[0].positionX).toBe(40);
    expect(list.tables()[0].positionY).toBe(60);
  });

  it('rolls back a position when persistence fails', () => {
    tablesApi.updatePosition.mockReturnValue(
      throwError(() => new Error('network'))
    );
    const list = component();
    list.tables.set([table]);

    list.updateTablePosition({
      table,
      positionX: 40,
      positionY: 60
    });

    expect(list.tables()[0].positionX).toBe(10);
    expect(list.tables()[0].positionY).toBe(20);
    expect(list.actionError()).toContain('could not be saved');
  });

  it('enables and disables a table', () => {
    tablesApi.enable.mockReturnValue(of(undefined));
    tablesApi.disable.mockReturnValue(of(undefined));
    const list = component();
    list.tables.set([{ ...table, status: 'Disabled' }]);

    list.enableTable(list.tables()[0]);
    expect(list.tables()[0].status).toBe('Available');

    list.disableTable(list.tables()[0]);
    expect(list.tables()[0].status).toBe('Disabled');
  });

  it('only allows deleting available or disabled tables', () => {
    const list = component();
    expect(list.canDelete(table)).toBe(true);
    expect(list.canDelete({ ...table, status: 'Disabled' })).toBe(true);
    expect(list.canDelete({ ...table, status: 'Occupied' })).toBe(false);
    expect(list.canDelete({ ...table, status: 'Reserved' })).toBe(false);
  });
});
