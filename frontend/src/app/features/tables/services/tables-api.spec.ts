import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { TablesApi } from './tables-api';
import { RestaurantTable } from '../../../shared/domain/tables/restaurant-table';
import { environment } from '../../../../environments/environment';

describe('TablesApi', () => {
  let api: TablesApi;
  let http: HttpTestingController;
  const baseUrl = `${environment.apiUrl}/Tables`;
  const table: RestaurantTable = {
    id: 1,
    number: 4,
    capacity: 6,
    status: 'Available',
    activeOrderId: null,
    positionX: 20,
    positionY: 30,
    version: 7
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    api = TestBed.inject(TablesApi);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('gets all tables', () => {
    api.getAll().subscribe(result => expect(result).toEqual([table]));
    const request = http.expectOne(baseUrl);
    expect(request.request.method).toBe('GET');
    request.flush([table]);
  });

  it('returns only available tables', () => {
    const disabled = { ...table, id: 2, status: 'Disabled' as const };
    api.getAvailable().subscribe(result => expect(result).toEqual([table]));
    http.expectOne(baseUrl).flush([table, disabled]);
  });

  it('gets a table by id', () => {
    api.getById(1).subscribe(result => expect(result).toEqual(table));
    const request = http.expectOne(`${baseUrl}/1`);
    expect(request.request.method).toBe('GET');
    request.flush(table);
  });

  it('creates and updates a table', () => {
    api.create({ number: 4, capacity: 6 }).subscribe();
    const create = http.expectOne(baseUrl);
    expect(create.request.method).toBe('POST');
    expect(create.request.body).toEqual({ number: 4, capacity: 6 });
    create.flush(table);

    api.update(1, { number: 5, capacity: 8, version: 7 }).subscribe();
    const update = http.expectOne(`${baseUrl}/1`);
    expect(update.request.method).toBe('PUT');
    expect(update.request.body).toEqual({
      number: 5,
      capacity: 8,
      version: 7
    });
    update.flush({ ...table, number: 5, capacity: 8 });
  });

  it.each([
    ['enable', 'enable'],
    ['disable', 'disable']
  ] as const)('%s a table', (method, path) => {
    api[method](1, 7).subscribe();
    const request = http.expectOne(`${baseUrl}/1/${path}`);
    expect(request.request.method).toBe('PATCH');
    expect(request.request.body).toEqual({ version: 7 });
    request.flush(null);
  });

  it('updates a table position', () => {
    api.updatePosition(1, {
      positionX: 42,
      positionY: 58,
      version: 7
    }).subscribe();
    const request = http.expectOne(`${baseUrl}/1/position`);
    expect(request.request.method).toBe('PATCH');
    expect(request.request.body).toEqual({
      positionX: 42,
      positionY: 58,
      version: 7
    });
    request.flush(null);
  });

  it('deletes a table', () => {
    api.delete(1, 7).subscribe();
    const request = http.expectOne(candidate =>
      candidate.url === `${baseUrl}/1`
      && candidate.params.get('version') === '7'
    );
    expect(request.request.method).toBe('DELETE');
    request.flush(null);
  });
});
