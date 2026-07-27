import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { CreateTableRequest } from '../models/create-table-request';
import { UpdateTableRequest } from '../models/update-table-request';
import { RestaurantTable } from '../../../shared/domain/tables/restaurant-table';

@Injectable({
  providedIn: 'root'
})
export class TablesApi {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/Tables`;

  getAll(): Observable<RestaurantTable[]> {
    return this.http.get<RestaurantTable[]>(this.baseUrl);
  }

  getById(id: number): Observable<RestaurantTable> {
    return this.http.get<RestaurantTable>(
      `${this.baseUrl}/${id}`
    );
  }

  create(
    request: CreateTableRequest
  ): Observable<RestaurantTable> {
    return this.http.post<RestaurantTable>(
      this.baseUrl,
      request
    );
  }

  update(
    id: number,
    request: UpdateTableRequest
  ): Observable<RestaurantTable> {
    return this.http.put<RestaurantTable>(
      `${this.baseUrl}/${id}`,
      request
    );
  }

  enable(id: number): Observable<void> {
    return this.http.patch<void>(
      `${this.baseUrl}/${id}/enable`,
      {}
    );
  }

  disable(id: number): Observable<void> {
    return this.http.patch<void>(
      `${this.baseUrl}/${id}/disable`,
      {}
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.baseUrl}/${id}`
    );
  }
}