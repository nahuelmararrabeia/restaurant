import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { Order } from '../../../shared/domain/orders/order';
import { AddOrderItemRequest } from '../models/add-order-item-request';
import { CreateOrderRequest } from '../models/create-order-request';
import { UpdateOrderItemRequest } from '../models/update-order-item-request';
import { PagedOrders } from '../models/paged-orders';

@Injectable({
  providedIn: 'root'
})
export class OrdersApi {
  private readonly http = inject(HttpClient);

  private readonly baseUrl = `${environment.apiUrl}/Orders`;

  getAll(
    page = 1,
    pageSize = 9
  ): Observable<PagedOrders> {
    const params = new HttpParams()
      .set('page', page)
      .set('pageSize', pageSize);

    return this.http.get<PagedOrders>(
      this.baseUrl,
      { params }
    );
  }

  getById(id: number): Observable<Order> {
    return this.http.get<Order>(
      `${this.baseUrl}/${id}`
    );
  }

  create(
    request: CreateOrderRequest,
    idempotencyKey: string
  ): Observable<Order> {
    return this.http.post<Order>(
      this.baseUrl,
      request,
      { headers: { 'Idempotency-Key': idempotencyKey } }
    );
  }

  addItem(
    orderId: number,
    request: AddOrderItemRequest,
    idempotencyKey: string
  ): Observable<Order> {
    return this.http.post<Order>(
      `${this.baseUrl}/${orderId}/items`,
      request,
      { headers: { 'Idempotency-Key': idempotencyKey } }
    );
  }

  updateItem(
    orderId: number,
    itemId: number,
    request: UpdateOrderItemRequest
  ): Observable<Order> {
    return this.http.put<Order>(
      `${this.baseUrl}/${orderId}/items/${itemId}`,
      request
    );
  }

  removeItem(
    orderId: number,
    itemId: number,
    version: number,
    itemVersion: number
  ): Observable<Order> {
    return this.http.delete<Order>(
      `${this.baseUrl}/${orderId}/items/${itemId}`,
      { params: { version, itemVersion } }
    );
  }

  startPreparing(
    orderId: number,
    version: number
  ): Observable<Order> {
    return this.http.patch<Order>(
      `${this.baseUrl}/${orderId}/preparing`,
      { version }
    );
  }

  markReady(orderId: number, version: number): Observable<Order> {
    return this.http.patch<Order>(
      `${this.baseUrl}/${orderId}/ready`,
      { version }
    );
  }

  deliver(orderId: number, version: number): Observable<Order> {
    return this.http.patch<Order>(
      `${this.baseUrl}/${orderId}/deliver`,
      { version }
    );
  }

  cancel(orderId: number, version: number): Observable<Order> {
    return this.http.patch<Order>(
      `${this.baseUrl}/${orderId}/cancel`,
      { version }
    );
  }
}
