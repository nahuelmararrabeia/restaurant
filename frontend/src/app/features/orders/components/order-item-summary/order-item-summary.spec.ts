import { TestBed } from '@angular/core/testing';

import { OrderItemSummary } from './order-item-summary';

describe('OrderItemSummary', () => {
  it('renders an item and emits quantity and remove actions', () => {
    const fixture = TestBed.createComponent(OrderItemSummary);
    fixture.componentRef.setInput('item', {
      id: 1,
      productId: 2,
      productName: 'Pizza',
      unitPrice: 12000,
      quantity: 2,
      notes: null,
      subtotal: 24000
    });
    fixture.componentRef.setInput('canEdit', true);
    fixture.detectChanges();
    const quantityChange = vi.fn();
    const remove = vi.fn();
    fixture.componentInstance.quantityChange.subscribe(quantityChange);
    fixture.componentInstance.remove.subscribe(remove);

    fixture.componentInstance.quantityChange.emit(1);
    fixture.componentInstance.remove.emit();

    expect(fixture.nativeElement.textContent).toContain('Pizza');
    expect(quantityChange).toHaveBeenCalledWith(1);
    expect(remove).toHaveBeenCalledOnce();
  });
});
