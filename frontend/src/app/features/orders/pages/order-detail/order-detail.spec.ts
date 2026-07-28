import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';

import { OrderDetail } from './order-detail';
import { OrdersService } from '../../services/orders-service';

describe('OrderDetail', () => {
  const order = {
    id: 3,
    tableId: 1,
    tableNumber: 1,
    status: 'Pending' as const,
    items: [{
      id: 10,
      productId: 2,
      productName: 'Pizza',
      unitPrice: 12000,
      quantity: 2,
      notes: null,
      subtotal: 24000
    }],
    total: 24000,
    orderedAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
    closedAt: ''
  };
  const state = {
    order: signal<typeof order | null>(order),
    products: signal([]),
    loading: signal(false),
    error: signal<string | null>(null),
    addingItem: signal(false),
    actionError: signal<string | null>(null),
    itemAction: signal(null),
    orderAction: signal(null),
    totalUnits: signal(2),
    canEdit: signal(true),
    canStartPreparing: signal(true),
    canMarkReady: signal(false),
    canDeliver: signal(false),
    canCancel: signal(true),
    initialize: vi.fn(),
    setInvalidOrderIdError: vi.fn(),
    loadOrder: vi.fn(),
    addItem: vi.fn(),
    changeItemQuantity: vi.fn(),
    removeItem: vi.fn(),
    performOrderAction: vi.fn(),
    clearActionError: vi.fn()
  };
  const router = { navigate: vi.fn().mockResolvedValue(true) };

  function component(id: string): OrderDetail {
    TestBed.configureTestingModule({
      imports: [OrderDetail],
      providers: [
        { provide: ActivatedRoute, useValue: {
          snapshot: { paramMap: convertToParamMap({ id }) }
        }},
        { provide: Router, useValue: router }
      ]
    });
    TestBed.overrideComponent(OrderDetail, {
      set: { providers: [{ provide: OrdersService, useValue: state }] }
    });
    return TestBed.createComponent(OrderDetail).componentInstance;
  }

  beforeEach(() => {
    vi.clearAllMocks();
    state.order.set(order);
  });

  it('initializes the service from a valid route id', () => {
    const detail = component('3');
    detail.ngOnInit();
    expect(state.initialize).toHaveBeenCalledWith(3);
  });

  it('reports an invalid route id', () => {
    const detail = component('invalid');
    detail.ngOnInit();
    expect(state.setInvalidOrderIdError).toHaveBeenCalledOnce();
  });

  it('delegates item changes', () => {
    const detail = component('3');
    detail.addItem({ productId: 2, quantity: 1, notes: null });
    detail.changeItemQuantity(10, 2, 1);
    expect(state.addItem).toHaveBeenCalled();
    expect(state.changeItemQuantity).toHaveBeenCalledWith(10, 2, 1);
  });

  it('confirms before removing an item', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    const detail = component('3');
    detail.removeItem(10);
    expect(state.removeItem).toHaveBeenCalledWith(10);
  });

  it('confirms cancellation but not other status actions', () => {
    const confirm = vi.spyOn(window, 'confirm').mockReturnValue(false);
    const detail = component('3');
    detail.performOrderAction('cancel');
    expect(state.performOrderAction).not.toHaveBeenCalled();
    detail.performOrderAction('start-preparing');
    expect(state.performOrderAction).toHaveBeenCalledWith('start-preparing');
    expect(confirm).toHaveBeenCalledOnce();
  });

  it('delegates error clearing and navigation', () => {
    const detail = component('3');
    detail.clearActionError();
    detail.goBack();
    expect(state.clearActionError).toHaveBeenCalledOnce();
    expect(router.navigate).toHaveBeenCalledWith(['/orders']);
  });
});
