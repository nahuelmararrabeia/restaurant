import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { Order } from '../../../shared/domain/orders/order';
import { AddOrderItemRequest } from '../models/add-order-item-request';
import { CreateOrderRequest } from '../models/create-order-request';
import { UpdateOrderItemRequest } from '../models/update-order-item-request';

@Injectable({
  providedIn: 'root'
})
export class OrdersApi {
  private readonly http = inject(HttpClient);

  private readonly baseUrl = `${environment.apiUrl}/Orders`;

  getAll(): Observable<Order[]> {
    return this.http.get<Order[]>(
      `${this.baseUrl}`
    );
  }

  getById(id: number): Observable<Order> {
    return this.http.get<Order>(
      `${this.baseUrl}/${id}`
    );
  }

  create(request: CreateOrderRequest): Observable<Order> {
    return this.http.post<Order>(
      this.baseUrl,
      request
    );
  }

  addItem(
    orderId: number,
    request: AddOrderItemRequest
  ): Observable<Order> {
    return this.http.post<Order>(
      `${this.baseUrl}/${orderId}/items`,
      request
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
    itemId: number
  ): Observable<Order> {
    return this.http.delete<Order>(
      `${this.baseUrl}/${orderId}/items/${itemId}`
    );
  }

  startPreparing(orderId: number): Observable<Order> {
    return this.http.patch<Order>(
      `${this.baseUrl}/${orderId}/preparing`,
      {}
    );
  }

  markReady(orderId: number): Observable<Order> {
    return this.http.patch<Order>(
      `${this.baseUrl}/${orderId}/ready`,
      {}
    );
  }

  deliver(orderId: number): Observable<Order> {
    return this.http.patch<Order>(
      `${this.baseUrl}/${orderId}/deliver`,
      {}
    );
  }

  cancel(orderId: number): Observable<Order> {
    return this.http.patch<Order>(
      `${this.baseUrl}/${orderId}/cancel`,
      {}
    );
  }
}