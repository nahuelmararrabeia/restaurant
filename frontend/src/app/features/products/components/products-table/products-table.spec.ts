import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { ProductsTable } from './products-table';

describe('ProductsTable', () => {
  it('renders products and emits the selected product for deletion', () => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    const fixture = TestBed.createComponent(ProductsTable);
    const product = {
      id: 1,
      name: 'Pizza',
      description: null,
      price: 12000,
      isAvailable: true,
      version: 7,
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: null
    };
    fixture.componentRef.setInput('products', [product]);
    fixture.detectChanges();
    const emitted = vi.fn();
    fixture.componentInstance.deleteProduct.subscribe(emitted);

    fixture.componentInstance.deleteProduct.emit(product);

    expect(fixture.nativeElement.textContent).toContain('Pizza');
    expect(emitted).toHaveBeenCalledWith(product);
  });
});
