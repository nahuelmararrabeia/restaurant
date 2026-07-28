import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { ProductList } from './product-list';
import { ProductsApi } from '../../services/products-api';
import { Product } from '../../../../shared/domain/products/product';

describe('ProductList', () => {
  const product: Product = {
    id: 1,
    name: 'Pizza',
    description: null,
    price: 12000,
    isAvailable: true,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: null
  };
  const api = { getAll: vi.fn(), delete: vi.fn() };

  beforeEach(() => {
    vi.clearAllMocks();
    TestBed.configureTestingModule({
      imports: [ProductList],
      providers: [{ provide: ProductsApi, useValue: api }]
    });
  });

  function component(): ProductList {
    return TestBed.createComponent(ProductList).componentInstance;
  }

  it('loads products', () => {
    api.getAll.mockReturnValue(of([product]));
    const list = component();
    list.loadProducts();
    expect(list.products()).toEqual([product]);
    expect(list.loading()).toBe(false);
  });

  it('shows an error when loading fails', () => {
    api.getAll.mockReturnValue(throwError(() => new Error('network')));
    const list = component();
    list.loadProducts();
    expect(list.error()).toBe('Could not load products.');
  });

  it('does not delete when confirmation is rejected', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(false);
    const list = component();
    list.deleteProduct(product);
    expect(api.delete).not.toHaveBeenCalled();
  });

  it('deletes a confirmed product from the list', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    api.delete.mockReturnValue(of(undefined));
    const list = component();
    list.products.set([product]);
    list.deleteProduct(product);
    expect(api.delete).toHaveBeenCalledWith(1);
    expect(list.products()).toEqual([]);
  });

  it.each([400, 409])(
    'shows a usage conflict for status %s',
    status => {
      vi.spyOn(window, 'confirm').mockReturnValue(true);
      api.delete.mockReturnValue(throwError(() => new HttpErrorResponse({
        status
      })));
      const list = component();
      list.deleteProduct(product);
      expect(list.actionError()).toContain('used in existing orders');
    }
  );

  it('clears action errors', () => {
    const list = component();
    list.actionError.set('Error');
    list.clearActionError();
    expect(list.actionError()).toBeNull();
  });
});
