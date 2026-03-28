import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/models';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private readonly API = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) {}

  addVendor(data: any): Observable<User> {
    return this.http.post<User>(`${this.API}/vendors`, data);
  }

  getAllVendors(): Observable<User[]> {
    return this.http.get<User[]>(`${this.API}/vendors`);
  }

  toggleVendor(id: number): Observable<User> {
    return this.http.put<User>(`${this.API}/vendors/${id}/toggle`, {});
  }
}
