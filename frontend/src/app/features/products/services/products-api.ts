import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { CreateProductRequest } from './models/create-product-request';
import { UpdateProductRequest } from './models/update-product-request';
import { Product } from '../../../shared/domain/products/product';

@Injectable({
  providedIn: 'root'
})
export class ProductsApi {
  private readonly http = inject(HttpClient);

  private readonly baseUrl = `${environment.apiUrl}/Products`;

  getAll(): Observable<Product[]> {
    return this.http.get<Product[]>(this.baseUrl);
  }

  getById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/${id}`);
  }

  create(request: CreateProductRequest): Observable<Product> {
    return this.http.post<Product>(this.baseUrl, request);
  }

  update(
    id: number,
    request: UpdateProductRequest
  ): Observable<Product> {
    return this.http.put<Product>(
      `${this.baseUrl}/${id}`,
      request
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
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
}