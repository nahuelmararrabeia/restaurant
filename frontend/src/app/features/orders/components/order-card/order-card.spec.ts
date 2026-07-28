import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { OrderCard } from './order-card';

describe('OrderCard', () => {
  it('calculates total product units', () => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    const fixture = TestBed.createComponent(OrderCard);
    fixture.componentRef.setInput('order', {
      id: 1,
      tableId: 1,
      tableNumber: 4,
      status: 'Pending',
      items: [
        { id: 1, productId: 1, productName: 'A', unitPrice: 1, quantity: 2, notes: null, subtotal: 2 },
        { id: 2, productId: 2, productName: 'B', unitPrice: 1, quantity: 3, notes: null, subtotal: 3 }
      ],
      total: 5,
      orderedAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-01T00:00:00Z',
      closedAt: ''
    });
    fixture.detectChanges();
    expect(fixture.componentInstance.totalUnits()).toBe(5);
  });
});
