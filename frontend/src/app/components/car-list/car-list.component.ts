import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CarService } from '../../services/car.service';
import { Car } from '../../models/models';

@Component({
  selector: 'app-car-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="page">
      <div class="page-header">
        <h1>Browse Cars</h1>
        <p>{{ filteredCars.length }} car(s) available</p>
      </div>

      <div class="search-bar">
        <input type="text" placeholder="Search by make or model..." [(ngModel)]="searchQuery" (input)="onSearch()" />
        <button (click)="onSearch()">🔍 Search</button>
      </div>

      <div class="filters">
        <select [(ngModel)]="fuelFilter" (change)="applyFilters()">
          <option value="">All Fuel Types</option>
          <option value="Petrol">Petrol</option>
          <option value="Diesel">Diesel</option>
          <option value="Electric">Electric</option>
          <option value="Hybrid">Hybrid</option>
        </select>
        <select [(ngModel)]="transFilter" (change)="applyFilters()">
          <option value="">All Transmissions</option>
          <option value="Automatic">Automatic</option>
          <option value="Manual">Manual</option>
        </select>
        <select [(ngModel)]="priceFilter" (change)="applyFilters()">
          <option value="">All Prices</option>
          <option value="500000">Under ₹5 Lakh</option>
          <option value="1000000">Under ₹10 Lakh</option>
          <option value="2000000">Under ₹20 Lakh</option>
          <option value="5000000">Under ₹50 Lakh</option>
        </select>
      </div>

      <div *ngIf="loading" class="loading">Loading cars...</div>

      <div class="car-grid" *ngIf="!loading">
        <div class="car-card" *ngFor="let car of filteredCars" [routerLink]="['/cars', car.id]">
          <div class="car-img">
            <img [src]="car.imageUrl || 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=400'" [alt]="car.title" />
            <span class="badge fuel">{{ car.fuelType }}</span>
          </div>
          <div class="car-info">
            <h3>{{ car.title }}</h3>
            <div class="car-tags">
              <span>{{ car.year }}</span>
              <span>{{ car.transmission }}</span>
              <span *ngIf="car.mileage">{{ car.mileage | number }} km</span>
            </div>
            <p class="vendor">By: {{ car.vendor?.name }}</p>
            <div class="car-footer">
              <span class="price">₹{{ car.price | number }}</span>
              <a [routerLink]="['/cars', car.id]" class="btn-view">View & Finance →</a>
            </div>
          </div>
        </div>
        <div class="no-results" *ngIf="filteredCars.length === 0">
          <p>No cars found matching your criteria.</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page { padding: 2rem 3rem; background: #f8f9fa; min-height: calc(100vh - 70px); }
    .page-header { margin-bottom: 2rem; }
    .page-header h1 { font-size: 2.2rem; font-weight: 800; color: #1a1a2e; }
    .page-header p { color: #888; }
    .search-bar { display: flex; gap: 1rem; margin-bottom: 1.5rem; }
    .search-bar input {
      flex: 1; padding: 0.8rem 1.2rem; border: 2px solid #e0e0e0;
      border-radius: 10px; font-size: 1rem; outline: none;
      transition: border 0.2s;
    }
    .search-bar input:focus { border-color: #e94560; }
    .search-bar button {
      background: #e94560; color: white; border: none;
      padding: 0.8rem 1.5rem; border-radius: 10px; cursor: pointer;
      font-weight: 600; font-size: 0.95rem; transition: background 0.2s;
    }
    .search-bar button:hover { background: #c73652; }
    .filters { display: flex; gap: 1rem; margin-bottom: 2rem; flex-wrap: wrap; }
    .filters select {
      padding: 0.6rem 1rem; border: 2px solid #e0e0e0;
      border-radius: 8px; font-size: 0.9rem; cursor: pointer;
      outline: none; background: white;
    }
    .loading { text-align: center; padding: 3rem; font-size: 1.1rem; color: #888; }
    .car-grid {
      display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem;
    }
    .car-card {
      background: white; border-radius: 16px; overflow: hidden;
      box-shadow: 0 2px 15px rgba(0,0,0,0.07);
      transition: transform 0.2s, box-shadow 0.2s; cursor: pointer;
    }
    .car-card:hover { transform: translateY(-4px); box-shadow: 0 8px 30px rgba(0,0,0,0.12); }
    .car-img { position: relative; height: 200px; overflow: hidden; }
    .car-img img { width: 100%; height: 100%; object-fit: cover; }
    .badge.fuel {
      position: absolute; top: 12px; left: 12px;
      background: rgba(26,26,46,0.85); color: white;
      padding: 0.2rem 0.8rem; border-radius: 20px; font-size: 0.78rem; font-weight: 600;
    }
    .car-info { padding: 1.2rem; }
    .car-info h3 { font-size: 1.05rem; font-weight: 700; color: #1a1a2e; margin-bottom: 0.5rem; }
    .car-tags { display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 0.5rem; }
    .car-tags span {
      background: #f0f0f0; padding: 0.2rem 0.6rem; border-radius: 12px;
      font-size: 0.78rem; color: #555;
    }
    .vendor { font-size: 0.82rem; color: #888; margin-bottom: 0.8rem; }
    .car-footer { display: flex; justify-content: space-between; align-items: center; }
    .price { font-size: 1.25rem; font-weight: 800; color: #e94560; }
    .btn-view {
      background: #1a1a2e; color: white; padding: 0.5rem 1rem;
      border-radius: 20px; text-decoration: none; font-size: 0.82rem;
      transition: background 0.2s;
    }
    .btn-view:hover { background: #e94560; }
    .no-results { grid-column: 1/-1; text-align: center; padding: 3rem; color: #888; }
    @media (max-width: 768px) { .page { padding: 1.5rem 1rem; } }
  `]
})
export class CarListComponent implements OnInit {
  cars: Car[] = [];
  filteredCars: Car[] = [];
  searchQuery = '';
  fuelFilter = '';
  transFilter = '';
  priceFilter = '';
  loading = true;

  constructor(private carService: CarService) {}

  ngOnInit() {
    this.carService.getAllCars().subscribe({
      next: cars => {
        this.cars = cars;
        this.filteredCars = cars;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  onSearch() {
    if (this.searchQuery.trim()) {
      this.carService.searchCars(this.searchQuery).subscribe(cars => {
        this.cars = cars;
        this.applyFilters();
      });
    } else {
      this.carService.getAllCars().subscribe(cars => {
        this.cars = cars;
        this.applyFilters();
      });
    }
  }

  applyFilters() {
    this.filteredCars = this.cars.filter(car => {
      if (this.fuelFilter && car.fuelType !== this.fuelFilter) return false;
      if (this.transFilter && car.transmission !== this.transFilter) return false;
      if (this.priceFilter && car.price > +this.priceFilter) return false;
      return true;
    });
  }
}
