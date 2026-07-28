import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { environment } from '../../../../environments/environment';
import { OrdersApi } from './orders-api';

describe('OrdersApi', () => {
  let api: OrdersApi;
  let http: HttpTestingController;
  const baseUrl = `${environment.apiUrl}/Orders`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    api = TestBed.inject(OrdersApi);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('gets a paged order list', () => {
    api.getAll(2, 5).subscribe();
    const request = http.expectOne(
      request => request.url === baseUrl
        && request.params.get('page') === '2'
        && request.params.get('pageSize') === '5'
    );
    expect(request.request.method).toBe('GET');
    request.flush({ items: [], page: 2, pageSize: 5, totalCount: 0, totalPages: 0 });
  });

  it('gets and creates orders', () => {
    api.getById(3).subscribe();
    const get = http.expectOne(`${baseUrl}/3`);
    expect(get.request.method).toBe('GET');
    get.flush({});

    api.create({ tableId: 4 }).subscribe();
    const create = http.expectOne(baseUrl);
    expect(create.request.method).toBe('POST');
    expect(create.request.body).toEqual({ tableId: 4 });
    create.flush({});
  });

  it('adds, updates and removes items', () => {
    api.addItem(3, { productId: 2, quantity: 1, notes: null }).subscribe();
    const add = http.expectOne(`${baseUrl}/3/items`);
    expect(add.request.method).toBe('POST');
    add.flush({});

    api.updateItem(3, 8, { quantity: 2, notes: 'No salt' }).subscribe();
    const update = http.expectOne(`${baseUrl}/3/items/8`);
    expect(update.request.method).toBe('PUT');
    expect(update.request.body).toEqual({ quantity: 2, notes: 'No salt' });
    update.flush({});

    api.removeItem(3, 8).subscribe();
    const remove = http.expectOne(`${baseUrl}/3/items/8`);
    expect(remove.request.method).toBe('DELETE');
    remove.flush({});
  });

  it.each([
    ['startPreparing', 'preparing'],
    ['markReady', 'ready'],
    ['deliver', 'deliver'],
    ['cancel', 'cancel']
  ] as const)('%s patches the order status', (method, path) => {
    api[method](3).subscribe();
    const request = http.expectOne(`${baseUrl}/3/${path}`);
    expect(request.request.method).toBe('PATCH');
    expect(request.request.body).toEqual({});
    request.flush({});
  });
});
