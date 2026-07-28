import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { of, throwError } from 'rxjs';

import { EditProduct } from './edit-product';
import { ProductsApi } from '../../services/products-api';

describe('EditProduct', () => {
  const product = {
    id: 2,
    name: 'Pasta',
    description: 'Fresh',
    price: 9000,
    isAvailable: true,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: null
  };
  const api = { getById: vi.fn(), update: vi.fn() };
  const router = { navigate: vi.fn().mockResolvedValue(true) };

  function createComponent(id: string | null = '2'): EditProduct {
    TestBed.configureTestingModule({
      imports: [EditProduct],
      providers: [
        { provide: ProductsApi, useValue: api },
        { provide: Router, useValue: router },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap(id === null ? {} : { id })
            }
          }
        }
      ]
    });
    return TestBed.createComponent(EditProduct).componentInstance;
  }

  beforeEach(() => vi.clearAllMocks());

  it('loads a product from the route id', () => {
    api.getById.mockReturnValue(of(product));
    const component = createComponent();
    component.ngOnInit();
    expect(api.getById).toHaveBeenCalledWith(2);
    expect(component.product()).toEqual(product);
    expect(component.loading()).toBe(false);
  });

  it('rejects invalid route ids', () => {
    const component = createComponent('invalid');
    component.ngOnInit();
    expect(api.getById).not.toHaveBeenCalled();
    expect(component.loadError()).toBe('The product ID is invalid.');
  });

  it('shows an error when loading fails', () => {
    api.getById.mockReturnValue(throwError(() => new Error('network')));
    const component = createComponent();
    component.ngOnInit();
    expect(component.loadError()).toBe('The product could not be loaded.');
  });

  it('updates the product and navigates', () => {
    api.getById.mockReturnValue(of(product));
    api.update.mockReturnValue(of(product));
    const component = createComponent();
    component.ngOnInit();
    component.updateProduct({
      name: 'Pasta XL',
      description: null,
      price: 10000
    });

    expect(api.update).toHaveBeenCalledWith(2, {
      name: 'Pasta XL',
      description: null,
      price: 10000
    });
    expect(router.navigate).toHaveBeenCalledWith(['/products']);
  });

  it('shows an error when update fails', () => {
    api.getById.mockReturnValue(of(product));
    api.update.mockReturnValue(throwError(() => new Error('network')));
    const component = createComponent();
    component.ngOnInit();
    component.updateProduct({
      name: 'Pasta',
      description: null,
      price: 10000
    });
    expect(component.saveError()).toContain('could not be updated');
  });
});
