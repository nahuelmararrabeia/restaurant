import { TestBed } from '@angular/core/testing';

import { AddOrderItemForm } from './add-order-item-form';

describe('AddOrderItemForm', () => {
  it('emits normalized item values and resets', () => {
    const fixture = TestBed.createComponent(AddOrderItemForm);
    fixture.componentRef.setInput('products', []);
    fixture.detectChanges();
    const component = fixture.componentInstance;
    const addItem = vi.fn();
    component.addItem.subscribe(addItem);
    component.form.setValue({ productId: 2, quantity: 3, notes: '  No salt  ' });

    component.submit();

    expect(addItem).toHaveBeenCalledWith({
      productId: 2,
      quantity: 3,
      notes: 'No salt'
    });
    component.reset();
    expect(component.form.getRawValue()).toEqual({
      productId: null,
      quantity: 1,
      notes: ''
    });
  });

  it('does not emit invalid values', () => {
    const fixture = TestBed.createComponent(AddOrderItemForm);
    fixture.componentRef.setInput('products', []);
    fixture.detectChanges();
    const addItem = vi.fn();
    fixture.componentInstance.addItem.subscribe(addItem);
    fixture.componentInstance.submit();
    expect(addItem).not.toHaveBeenCalled();
  });

  it('disables the form while loading', () => {
    const fixture = TestBed.createComponent(AddOrderItemForm);
    fixture.componentRef.setInput('products', []);
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();
    expect(fixture.componentInstance.form.disabled).toBe(true);
  });
});
