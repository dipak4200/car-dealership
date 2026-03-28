import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Car } from '../models/models';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CarService {
  private readonly API = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Public
  getAllCars(search?: string): Observable<Car[]> {
    let params = new HttpParams();
    if (search) params = params.set('search', search);
    return this.http.get<Car[]>(`${this.API}/cars`, { params });
  }

  searchCars(query: string): Observable<Car[]> {
    return this.getAllCars(query);
  }

  getCarById(id: number): Observable<Car> {
    return this.http.get<Car>(`${this.API}/cars/${id}`);
  }

  // Vendor
  getVendorCars(): Observable<Car[]> {
    return this.http.get<Car[]>(`${this.API}/vendor/cars`);
  }

  addCar(data: any): Observable<Car> {
    return this.http.post<Car>(`${this.API}/vendor/cars`, data);
  }

  updateCar(id: number, data: any): Observable<Car> {
    return this.http.put<Car>(`${this.API}/vendor/cars/${id}`, data);
  }

  deleteCar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API}/vendor/cars/${id}`);
  }
}
