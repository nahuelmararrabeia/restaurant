import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { Order } from '../../../shared/domain/orders/order';
import { ProductsApi } from '../../products/services/products-api';
import { OrdersApi } from './orders-api';
import { OrdersService } from './orders-service';

describe('OrdersService', () => {
  const item = {
    id: 10,
    productId: 2,
    productName: 'Pizza',
    unitPrice: 12000,
    quantity: 2,
    notes: 'Well done',
    subtotal: 24000,
    version: 4
  };
  const pending: Order = {
    id: 3,
    tableId: 1,
    tableNumber: 1,
    status: 'Pending',
    items: [item],
    total: 24000,
    orderedAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
    closedAt: '',
    version: 7
  };
  const ordersApi = {
    getById: vi.fn(),
    addItem: vi.fn(),
    updateItem: vi.fn(),
    removeItem: vi.fn(),
    startPreparing: vi.fn(),
    markReady: vi.fn(),
    deliver: vi.fn(),
    cancel: vi.fn()
  };
  const productsApi = { getAll: vi.fn() };

  beforeEach(() => {
    vi.clearAllMocks();
    TestBed.configureTestingModule({
      providers: [
        OrdersService,
        { provide: OrdersApi, useValue: ordersApi },
        { provide: ProductsApi, useValue: productsApi }
      ]
    });
  });

  function service(): OrdersService {
    return TestBed.inject(OrdersService);
  }

  it('loads the order and products and computes permissions', () => {
    ordersApi.getById.mockReturnValue(of(pending));
    productsApi.getAll.mockReturnValue(of([]));
    const state = service();
    state.initialize(3);

    expect(state.order()).toEqual(pending);
    expect(state.totalUnits()).toBe(2);
    expect(state.canEdit()).toBe(true);
    expect(state.canStartPreparing()).toBe(true);
    expect(state.canCancel()).toBe(true);
    expect(state.loading()).toBe(false);
  });

  it('reports load failures and invalid ids', () => {
    ordersApi.getById.mockReturnValue(throwError(() => new Error('network')));
    productsApi.getAll.mockReturnValue(of([]));
    const state = service();
    state.initialize(3);
    expect(state.error()).toContain('could not be loaded');
    state.setInvalidOrderIdError();
    expect(state.error()).toBe('The order ID is invalid.');
  });

  it('adds an item and invokes the success callback', () => {
    ordersApi.getById.mockReturnValue(of(pending));
    productsApi.getAll.mockReturnValue(of([]));
    ordersApi.addItem.mockReturnValue(of({
      ...pending,
      items: [{ ...item, quantity: 3 }]
    }));
    const state = service();
    state.initialize(3);
    const success = vi.fn();
    state.addItem({ productId: 2, quantity: 3, notes: null }, success);

    expect(ordersApi.addItem).toHaveBeenCalledWith(
      3,
      {
        productId: 2,
        quantity: 3,
        notes: null,
        version: 7
      },
      expect.any(String)
    );
    expect(success).toHaveBeenCalledOnce();
    expect(state.totalUnits()).toBe(3);
  });

  it.each([
    [404, 'no longer exists'],
    [500, 'could not be added']
  ])('handles add item error %s', (status, message) => {
    ordersApi.getById.mockReturnValue(of(pending));
    productsApi.getAll.mockReturnValue(of([]));
    ordersApi.addItem.mockReturnValue(throwError(() => new HttpErrorResponse({ status })));
    const state = service();
    state.initialize(3);
    state.addItem({ productId: 2, quantity: 1, notes: null });
    expect(state.actionError()).toContain(message);
  });

  it('updates item quantities and preserves notes', () => {
    ordersApi.getById.mockReturnValue(of(pending));
    productsApi.getAll.mockReturnValue(of([]));
    ordersApi.updateItem.mockReturnValue(of({
      ...pending,
      items: [{ ...item, quantity: 3 }]
    }));
    const state = service();
    state.initialize(3);
    state.changeItemQuantity(10, 2, 1);

    expect(ordersApi.updateItem).toHaveBeenCalledWith(3, 10, {
      quantity: 3,
      notes: 'Well done',
      version: 7,
      itemVersion: 4
    });
    expect(state.totalUnits()).toBe(3);
  });

  it('does not reduce an item below one', () => {
    ordersApi.getById.mockReturnValue(of({
      ...pending,
      items: [{ ...item, quantity: 1 }]
    }));
    productsApi.getAll.mockReturnValue(of([]));
    const state = service();
    state.initialize(3);
    state.changeItemQuantity(10, 1, -1);
    expect(ordersApi.updateItem).not.toHaveBeenCalled();
  });

  it('removes an existing item', () => {
    ordersApi.getById.mockReturnValue(of(pending));
    productsApi.getAll.mockReturnValue(of([]));
    ordersApi.removeItem.mockReturnValue(of({ ...pending, items: [] }));
    const state = service();
    state.initialize(3);
    state.removeItem(10);
    expect(ordersApi.removeItem).toHaveBeenCalledWith(3, 10, 7, 4);
    expect(state.order()?.items).toEqual([]);
  });

  it.each([
    ['start-preparing', 'startPreparing', 'Preparing'],
    ['cancel', 'cancel', 'Cancelled']
  ] as const)('performs %s when allowed', (action, method, status) => {
    ordersApi.getById.mockReturnValue(of(pending));
    productsApi.getAll.mockReturnValue(of([]));
    ordersApi[method].mockReturnValue(of({ ...pending, status }));
    const state = service();
    state.initialize(3);
    state.performOrderAction(action);
    expect(ordersApi[method]).toHaveBeenCalledWith(3, 7);
    expect(state.order()?.status).toBe(status);
  });

  it('exposes current action state and clears errors', () => {
    const state = service();
    state.itemAction.set({ itemId: 10, action: 'remove' });
    state.orderAction.set('cancel');
    state.actionError.set('Error');
    expect(state.isItemBusy(10)).toBe(true);
    expect(state.isItemActionRunning(10, 'remove')).toBe(true);
    expect(state.isOrderActionRunning('cancel')).toBe(true);
    state.clearActionError();
    expect(state.actionError()).toBeNull();
  });
});
