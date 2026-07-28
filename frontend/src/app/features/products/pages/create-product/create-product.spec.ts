import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, Subject, throwError } from 'rxjs';

import { CreateProduct } from './create-product';
import { ProductsApi } from '../../services/products-api';

describe('CreateProduct', () => {
  const api = { create: vi.fn() };
  const router = { navigate: vi.fn().mockResolvedValue(true) };

  beforeEach(() => {
    vi.clearAllMocks();
    TestBed.configureTestingModule({
      imports: [CreateProduct],
      providers: [
        { provide: ProductsApi, useValue: api },
        { provide: Router, useValue: router }
      ]
    });
  });

  it('creates a product and navigates to the list', () => {
    api.create.mockReturnValue(of({}));
    const component = TestBed.createComponent(CreateProduct).componentInstance;
    const value = { name: 'Pizza', description: null, price: 12000 };

    component.createProduct(value);

    expect(api.create).toHaveBeenCalledWith(value);
    expect(router.navigate).toHaveBeenCalledWith(['/products']);
    expect(component.saving()).toBe(false);
  });

  it('shows an error when creation fails', () => {
    api.create.mockReturnValue(throwError(() => new Error('network')));
    const component = TestBed.createComponent(CreateProduct).componentInstance;
    component.createProduct({ name: 'Pizza', description: null, price: 12000 });
    expect(component.error()).toContain('could not be created');
  });

  it('prevents duplicate submissions while saving', () => {
    api.create.mockReturnValue(new Subject());
    const component = TestBed.createComponent(CreateProduct).componentInstance;
    const value = { name: 'Pizza', description: null, price: 12000 };
    component.createProduct(value);
    component.createProduct(value);
    expect(api.create).toHaveBeenCalledOnce();
  });

  it('navigates back when cancelled', () => {
    const component = TestBed.createComponent(CreateProduct).componentInstance;
    component.cancel();
    expect(router.navigate).toHaveBeenCalledWith(['/products']);
  });
});
