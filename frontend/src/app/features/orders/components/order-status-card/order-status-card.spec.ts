import { TestBed } from '@angular/core/testing';

import { OrderStatusCard } from './order-status-card';

describe('OrderStatusCard', () => {
  it('renders the order and emits status actions', () => {
    const fixture = TestBed.createComponent(OrderStatusCard);
    fixture.componentRef.setInput('order', {
      id: 1,
      tableId: 1,
      tableNumber: 1,
      status: 'Pending',
      items: [],
      total: 0,
      orderedAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-01T00:00:00Z',
      closedAt: ''
    });
    fixture.componentRef.setInput('canStartPreparing', true);
    fixture.detectChanges();
    const action = vi.fn();
    fixture.componentInstance.performAction.subscribe(action);
    fixture.componentInstance.performAction.emit('start-preparing');
    expect(action).toHaveBeenCalledWith('start-preparing');
  });
});
