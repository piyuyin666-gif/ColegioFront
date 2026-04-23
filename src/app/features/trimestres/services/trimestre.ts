import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Trimestre } from '../models/trimestre-model';
import { TrimestreCreate } from '../models/trimestre-create.model';
import { TrimestreUpdate } from '../models/trimestre-update.model';
import { QueryFilter } from '../../../core/models/query-filter.model';
import { ApiResponse } from '../../../core/models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class TrimestreService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/Trimestre`;

  getAll(filter: QueryFilter): Observable<ApiResponse<Trimestre[]>> {
    const params = new HttpParams()
      .set('PageNumber', filter.pageNumber)
      .set('PageSize', filter.pageSize)
      .set('Buscar', filter.buscar || '');

    return this.http.get<ApiResponse<Trimestre[]>>(this.apiUrl, { params });
  }

  getById(id: number): Observable<Trimestre> {
    return this.http.get<Trimestre>(`${this.apiUrl}/${id}`);
  }

  create(data: TrimestreCreate): Observable<Trimestre> {
    return this.http.post<Trimestre>(this.apiUrl, data);
  }

  update(id: number, data: TrimestreUpdate): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
