import { TestBed } from '@angular/core/testing';

import { TableStatusBadge } from './table-status-badge';

describe('TableStatusBadge', () => {
  it.each([
    ['Available', 'bg-green-100 text-green-700'],
    ['Occupied', 'bg-red-100 text-red-700'],
    ['Reserved', 'bg-amber-100 text-amber-700'],
    ['Disabled', 'bg-slate-100 text-slate-600']
  ] as const)('maps %s to its label and classes', (status, cssClass) => {
    const fixture = TestBed.createComponent(TableStatusBadge);
    fixture.componentRef.setInput('status', status);
    fixture.detectChanges();

    expect(fixture.componentInstance.label()).toBe(status);
    expect(fixture.componentInstance.badgeClass()).toBe(cssClass);
  });
});
