import { TestBed } from '@angular/core/testing';

import { OrderSummaryCard } from './order-summary-card';

describe('OrderSummaryCard', () => {
  it('renders totals and status', () => {
    const fixture = TestBed.createComponent(OrderSummaryCard);
    fixture.componentRef.setInput('order', {
      id: 1,
      tableId: 1,
      tableNumber: 1,
      status: 'Pending',
      items: [],
      total: 12000,
      orderedAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-01T00:00:00Z',
      closedAt: ''
    });
    fixture.componentRef.setInput('totalUnits', 3);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('3');
    expect(fixture.nativeElement.textContent).toContain('Draft');
  });
});
