import { TestBed } from '@angular/core/testing';

import { OrderStatusBadge } from './order-status-badge';

describe('OrderStatusBadge', () => {
  it.each([
    ['Pending', 'Draft', 'bg-slate-100'],
    ['Preparing', 'Preparing', 'bg-amber-50'],
    ['Ready', 'Ready', 'bg-green-50'],
    ['Delivered', 'Delivered', 'bg-violet-50'],
    ['Paid', 'Paid', 'bg-emerald-50'],
    ['Cancelled', 'Cancelled', 'bg-red-50']
  ] as const)('maps %s to its presentation', (status, label, cssClass) => {
    const fixture = TestBed.createComponent(OrderStatusBadge);
    fixture.componentRef.setInput('status', status);
    fixture.detectChanges();
    expect(fixture.componentInstance.label()).toBe(label);
    expect(fixture.componentInstance.badgeClass()).toContain(cssClass);
  });
});
