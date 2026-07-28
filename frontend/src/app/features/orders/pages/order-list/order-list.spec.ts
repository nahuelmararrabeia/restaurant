import { TestBed } from '@angular/core/testing';
import { of, Subject, throwError } from 'rxjs';

import { OrderList } from './order-list';
import { OrdersApi } from '../../services/orders-api';

describe('OrderList', () => {
  const api = { getAll: vi.fn() };

  beforeEach(() => {
    vi.clearAllMocks();
    TestBed.configureTestingModule({
      imports: [OrderList],
      providers: [{ provide: OrdersApi, useValue: api }]
    });
  });

  function component(): OrderList {
    return TestBed.createComponent(OrderList).componentInstance;
  }

  it('loads pagination data', () => {
    api.getAll.mockReturnValue(of({
      items: [],
      page: 2,
      pageSize: 9,
      totalCount: 20,
      totalPages: 3
    }));
    const list = component();
    list.page.set(2);
    list.loadOrders();
    expect(api.getAll).toHaveBeenCalledWith(2, 9);
    expect(list.totalCount()).toBe(20);
    expect(list.totalPages()).toBe(3);
  });

  it('reports load errors', () => {
    api.getAll.mockReturnValue(throwError(() => new Error('network')));
    const list = component();
    list.loadOrders();
    expect(list.error()).toContain('could not be loaded');
  });

  it('loads a valid different page', () => {
    api.getAll.mockReturnValue(of({
      items: [], page: 2, pageSize: 9, totalCount: 20, totalPages: 3
    }));
    const list = component();
    list.totalPages.set(3);
    list.goToPage(2);
    expect(list.page()).toBe(2);
    expect(api.getAll).toHaveBeenCalledWith(2, 9);
  });

  it('ignores invalid, current, and loading page changes', () => {
    api.getAll.mockReturnValue(new Subject());
    const list = component();
    list.totalPages.set(3);
    list.goToPage(0);
    list.goToPage(4);
    list.goToPage(1);
    expect(api.getAll).not.toHaveBeenCalled();
    list.loadOrders();
    list.goToPage(2);
    expect(api.getAll).toHaveBeenCalledOnce();
  });
});
