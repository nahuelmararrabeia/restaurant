import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableForm } from './table-form';

describe('TableForm', () => {
  let fixture: ComponentFixture<TableForm>;
  let component: TableForm;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TableForm] })
      .compileComponents();
    fixture = TestBed.createComponent(TableForm);
    component = fixture.componentInstance;
  });

  it('emits valid values', () => {
    const save = vi.fn();
    component.save.subscribe(save);
    component.form.setValue({ number: 12, capacity: 4 });

    component.submit();

    expect(save).toHaveBeenCalledWith({ number: 12, capacity: 4 });
  });

  it('marks an invalid form as touched and does not emit', () => {
    const save = vi.fn();
    component.save.subscribe(save);
    component.form.setValue({ number: 0, capacity: 51 });

    component.submit();

    expect(save).not.toHaveBeenCalled();
    expect(component.hasError('number', 'min')).toBe(true);
    expect(component.hasError('capacity', 'max')).toBe(true);
  });

  it('emits cancel', () => {
    const cancel = vi.fn();
    component.cancel.subscribe(cancel);
    component.cancelForm();
    expect(cancel).toHaveBeenCalledOnce();
  });

  it('loads and resets the initial table value', () => {
    fixture.componentRef.setInput('initialValue', {
      id: 1,
      number: 8,
      capacity: 10,
      status: 'Available',
      activeOrderId: null,
      positionX: null,
      positionY: null
    });
    fixture.detectChanges();

    expect(component.form.getRawValue()).toEqual({
      number: 8,
      capacity: 10
    });
    expect(component.form.pristine).toBe(true);
  });
});
