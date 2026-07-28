import { TestBed } from '@angular/core/testing';

import { ProductStatusBadge } from './product-status-badge';

describe('ProductStatusBadge', () => {
  it.each([
    [true, 'Available'],
    [false, 'Unavailable']
  ])('renders the status for available=%s', (available, label) => {
    const fixture = TestBed.createComponent(ProductStatusBadge);
    fixture.componentRef.setInput('available', available);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain(label);
  });
});
