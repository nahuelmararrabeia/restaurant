import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { DashboardResponse } from '../models/dashboard-response';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardApi {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/Dashboard`;

  get(): Observable<DashboardResponse> {
    return this.http.get<DashboardResponse>(
      this.baseUrl
    );
  }
}