import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { environment } from '../../../../environments/environment';
import { Product } from '../../../shared/domain/products/product';
import { ProductsApi } from './products-api';

describe('ProductsApi', () => {
  let api: ProductsApi;
  let http: HttpTestingController;
  const baseUrl = `${environment.apiUrl}/Products`;
  const product: Product = {
    id: 1,
    name: 'Pizza',
    description: 'Stone baked',
    price: 12000,
    isAvailable: true,
    version: 7,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: null
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    api = TestBed.inject(ProductsApi);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('gets all products', () => {
    api.getAll().subscribe(result => expect(result).toEqual([product]));
    const request = http.expectOne(baseUrl);
    expect(request.request.method).toBe('GET');
    request.flush([product]);
  });

  it('gets a product by id', () => {
    api.getById(1).subscribe(result => expect(result).toEqual(product));
    const request = http.expectOne(`${baseUrl}/1`);
    expect(request.request.method).toBe('GET');
    request.flush(product);
  });

  it('creates a product', () => {
    const body = { name: 'Pizza', description: null, price: 12000 };
    api.create(body).subscribe();
    const request = http.expectOne(baseUrl);
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(body);
    request.flush(product);
  });

  it('updates a product', () => {
    const body = {
      name: 'Pasta',
      description: 'Fresh',
      price: 9000,
      version: 7
    };
    api.update(1, body).subscribe();
    const request = http.expectOne(`${baseUrl}/1`);
    expect(request.request.method).toBe('PUT');
    expect(request.request.body).toEqual(body);
    request.flush({ ...product, ...body });
  });

  it('deletes a product', () => {
    api.delete(1, 7).subscribe();
    const request = http.expectOne(candidate =>
      candidate.url === `${baseUrl}/1`
      && candidate.params.get('version') === '7'
    );
    expect(request.request.method).toBe('DELETE');
    request.flush(null);
  });

  it.each([
    ['enable', 'enable'],
    ['disable', 'disable']
  ] as const)('%s a product', (method, path) => {
    api[method](1, 7).subscribe();
    const request = http.expectOne(`${baseUrl}/1/${path}`);
    expect(request.request.method).toBe('PATCH');
    expect(request.request.body).toEqual({ version: 7 });
    request.flush(null);
  });
});
