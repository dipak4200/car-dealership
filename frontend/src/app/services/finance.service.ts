import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FinanceCalculation, FinanceRequest } from '../models/models';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class FinanceService {
  private readonly API = `${environment.apiUrl}/finance`;

  constructor(private http: HttpClient) {}

  calculate(data: {
    carPrice: number;
    downPayment: number;
    annualInterestRate: number;
    termMonths: number;
  }): Observable<FinanceCalculation> {
    return this.http.post<FinanceCalculation>(`${this.API}/calculate`, data);
  }

  apply(data: any): Observable<FinanceRequest> {
    return this.http.post<FinanceRequest>(`${this.API}/apply`, data);
  }

  getMyRequests(): Observable<FinanceRequest[]> {
    return this.http.get<FinanceRequest[]>(`${this.API}/my-requests`);
  }
}
