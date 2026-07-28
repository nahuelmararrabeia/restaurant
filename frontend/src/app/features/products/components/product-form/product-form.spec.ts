import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductForm } from './product-form';

describe('ProductForm', () => {
  let fixture: ComponentFixture<ProductForm>;
  let component: ProductForm;

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductForm);
    component = fixture.componentInstance;
  });

  it('emits trimmed valid values', () => {
    const save = vi.fn();
    component.save.subscribe(save);
    component.form.setValue({
      name: '  Pizza  ',
      description: '  Stone baked  ',
      price: 12000
    });

    component.submit();

    expect(save).toHaveBeenCalledWith({
      name: 'Pizza',
      description: 'Stone baked',
      price: 12000
    });
  });

  it('normalizes an empty description to null', () => {
    const save = vi.fn();
    component.save.subscribe(save);
    component.form.setValue({
      name: 'Pizza',
      description: '   ',
      price: 12000
    });
    component.submit();
    expect(save.mock.calls[0][0].description).toBeNull();
  });

  it('marks an invalid form as touched without emitting', () => {
    const save = vi.fn();
    component.save.subscribe(save);
    component.form.setValue({ name: '', description: '', price: 0 });
    component.submit();

    expect(save).not.toHaveBeenCalled();
    expect(component.hasError('name', 'required')).toBe(true);
    expect(component.hasError('price', 'min')).toBe(true);
  });

  it('loads the initial product value', () => {
    fixture.componentRef.setInput('initialValue', {
      id: 1,
      name: 'Pizza',
      description: null,
      price: 12000,
      isAvailable: true,
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: null
    });
    fixture.detectChanges();

    expect(component.form.getRawValue()).toEqual({
      name: 'Pizza',
      description: '',
      price: 12000
    });
    expect(component.form.pristine).toBe(true);
  });

  it('emits cancel', () => {
    const cancel = vi.fn();
    component.cancel.subscribe(cancel);
    component.cancelForm();
    expect(cancel).toHaveBeenCalledOnce();
  });
});
