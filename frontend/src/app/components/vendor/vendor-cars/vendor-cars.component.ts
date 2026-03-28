import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CarService } from '../../../services/car.service';
import { Car } from '../../../models/models';

@Component({
  selector: 'app-vendor-cars',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="page">
      <div class="page-header">
        <h1>My Car Listings</h1>
        <p>Manage your vehicle listings</p>
        <button class="btn-add" (click)="openForm()">+ Add New Car</button>
      </div>

      <!-- Add/Edit Form -->
      <div class="card" *ngIf="showForm">
        <h2>{{ editingId ? 'Edit Car' : 'Add New Car' }}</h2>
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="form-grid">
            <div class="form-group">
              <label>Title</label>
              <input type="text" formControlName="title" placeholder="e.g. 2023 Toyota Camry XLE" />
            </div>
            <div class="form-group">
              <label>Make</label>
              <input type="text" formControlName="make" placeholder="Toyota" />
            </div>
            <div class="form-group">
              <label>Model</label>
              <input type="text" formControlName="model" placeholder="Camry" />
            </div>
            <div class="form-group">
              <label>Year</label>
              <input type="number" formControlName="year" placeholder="2023" />
            </div>
            <div class="form-group">
              <label>Price (₹)</label>
              <input type="number" formControlName="price" placeholder="1500000" />
            </div>
            <div class="form-group">
              <label>Mileage (km)</label>
              <input type="number" formControlName="mileage" placeholder="0" />
            </div>
            <div class="form-group">
              <label>Fuel Type</label>
              <select formControlName="fuelType">
                <option value="">Select</option>
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="Electric">Electric</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>
            <div class="form-group">
              <label>Transmission</label>
              <select formControlName="transmission">
                <option value="">Select</option>
                <option value="Automatic">Automatic</option>
                <option value="Manual">Manual</option>
              </select>
            </div>
            <div class="form-group">
              <label>Color</label>
              <input type="text" formControlName="color" placeholder="White" />
            </div>
            <div class="form-group">
              <label>Image URL</label>
              <input type="text" formControlName="imageUrl" placeholder="https://..." />
            </div>
            <div class="form-group full-width">
              <label>Description</label>
              <textarea formControlName="description" rows="3" placeholder="Describe the car..."></textarea>
            </div>
          </div>
          <div class="form-actions">
            <button type="submit" [disabled]="saving">{{ saving ? 'Saving...' : (editingId ? 'Update Car' : 'Add Car') }}</button>
            <button type="button" class="btn-cancel" (click)="cancelForm()">Cancel</button>
          </div>
        </form>
        <div class="success" *ngIf="msg">✅ {{ msg }}</div>
        <div class="error" *ngIf="error">❌ {{ error }}</div>
      </div>

      <!-- Cars Grid -->
      <div class="car-grid" *ngIf="!loading">
        <div class="car-card" *ngFor="let car of cars">
          <div class="car-img">
            <img [src]="car.imageUrl || 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=400'" [alt]="car.title" />
          </div>
          <div class="car-info">
            <h3>{{ car.title }}</h3>
            <p class="car-meta">{{ car.year }} · {{ car.transmission }} · {{ car.fuelType }}</p>
            <p class="price">₹{{ car.price | number }}</p>
            <div class="car-actions">
              <button class="btn-edit" (click)="edit(car)">✏️ Edit</button>
              <button class="btn-del" (click)="deleteCar(car.id)">🗑️ Delete</button>
            </div>
          </div>
        </div>
        <div class="empty" *ngIf="cars.length === 0">No cars listed yet. Click "Add New Car" to get started!</div>
      </div>
      <div class="loading" *ngIf="loading">Loading...</div>
    </div>
  `,
  styles: [`
    .page { padding: 2rem 3rem; background: #f8f9fa; min-height: calc(100vh - 70px); }
    .page-header { display: flex; align-items: flex-start; gap: 1rem; flex-wrap: wrap; margin-bottom: 2rem; }
    .page-header h1 { font-size: 2rem; font-weight: 800; color: #1a1a2e; flex: 1; }
    .page-header p { color: #888; margin-top: 0.3rem; width: 100%; order: 2; }
    .btn-add {
      background: #e94560; color: white; border: none; padding: 0.7rem 1.5rem;
      border-radius: 10px; font-weight: 700; cursor: pointer; white-space: nowrap;
      transition: background 0.2s;
    }
    .btn-add:hover { background: #c73652; }
    .card { background: white; border-radius: 16px; padding: 2rem; margin-bottom: 2rem; box-shadow: 0 4px 20px rgba(0,0,0,0.06); }
    .card h2 { font-size: 1.2rem; font-weight: 700; color: #1a1a2e; margin-bottom: 1.5rem; }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .form-group { display: flex; flex-direction: column; }
    .form-group.full-width { grid-column: 1 / -1; }
    .form-group label { font-size: 0.85rem; font-weight: 600; color: #555; margin-bottom: 0.4rem; }
    .form-group input, .form-group select, .form-group textarea {
      padding: 0.75rem 1rem; border: 2px solid #e0e0e0; border-radius: 10px;
      font-size: 0.9rem; outline: none; transition: border 0.2s;
    }
    .form-group input:focus, .form-group select:focus, .form-group textarea:focus { border-color: #e94560; }
    .form-actions { display: flex; gap: 1rem; margin-top: 1.2rem; }
    .form-actions button {
      background: #e94560; color: white; border: none; padding: 0.75rem 2rem;
      border-radius: 10px; font-weight: 700; cursor: pointer;
    }
    .btn-cancel { background: #f0f0f0 !important; color: #555 !important; }
    .success { color: #4ecdc4; font-weight: 600; margin-top: 1rem; }
    .error { color: #e94560; font-weight: 600; margin-top: 1rem; }
    .car-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.5rem; }
    .car-card { background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 2px 15px rgba(0,0,0,0.07); }
    .car-img { height: 180px; overflow: hidden; }
    .car-img img { width: 100%; height: 100%; object-fit: cover; }
    .car-info { padding: 1.1rem; }
    .car-info h3 { font-size: 1rem; font-weight: 700; color: #1a1a2e; margin-bottom: 0.4rem; }
    .car-meta { color: #888; font-size: 0.82rem; margin-bottom: 0.5rem; }
    .price { font-size: 1.2rem; font-weight: 800; color: #e94560; margin-bottom: 0.8rem; }
    .car-actions { display: flex; gap: 0.5rem; }
    .btn-edit, .btn-del {
      flex: 1; padding: 0.4rem; border: none; border-radius: 8px;
      font-size: 0.82rem; font-weight: 600; cursor: pointer; transition: opacity 0.2s;
    }
    .btn-edit { background: #e3f0ff; color: #1565c0; }
    .btn-del { background: #fde8e8; color: #e94560; }
    .btn-edit:hover, .btn-del:hover { opacity: 0.8; }
    .empty { grid-column: 1/-1; text-align: center; padding: 3rem; color: #888; }
    .loading { text-align: center; padding: 3rem; color: #888; }
    @media (max-width: 768px) { .page { padding: 1.5rem 1rem; } .form-grid { grid-template-columns: 1fr; } }
  `]
})
export class VendorCarsComponent implements OnInit {
  cars: Car[] = [];
  form;
  loading = true;
  saving = false;
  showForm = false;
  editingId: number | null = null;
  msg = '';
  error = '';

  constructor(private carService: CarService, private fb: FormBuilder) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      make: ['', Validators.required],
      model: ['', Validators.required],
      year: ['', [Validators.required, Validators.min(1900)]],
      price: ['', [Validators.required, Validators.min(1)]],
      mileage: [''],
      fuelType: [''],
      transmission: [''],
      color: [''],
      imageUrl: [''],
      description: ['']
    });
  }

  ngOnInit() { this.loadCars(); }

  loadCars() {
    this.loading = true;
    this.carService.getVendorCars().subscribe({
      next: cars => { this.cars = cars; this.loading = false; },
      error: () => this.loading = false
    });
  }

  openForm() { this.showForm = true; this.editingId = null; this.form.reset(); }
  cancelForm() { this.showForm = false; this.editingId = null; this.msg = ''; this.error = ''; }

  edit(car: Car) {
    this.showForm = true;
    this.editingId = car.id;
    this.form.patchValue({
      title: car.title,
      make: car.make,
      model: car.model,
      year: car.year?.toString(),
      price: car.price?.toString(),
      mileage: car.mileage?.toString() ?? '',
      fuelType: car.fuelType,
      transmission: car.transmission,
      color: car.color,
      imageUrl: car.imageUrl,
      description: car.description
    });
  }

  onSubmit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving = true;
    this.msg = '';
    this.error = '';
    const obs = this.editingId
      ? this.carService.updateCar(this.editingId, this.form.value)
      : this.carService.addCar(this.form.value);

    obs.subscribe({
      next: () => {
        this.msg = this.editingId ? 'Car updated!' : 'Car added successfully!';
        this.saving = false;
        this.cancelForm();
        this.loadCars();
      },
      error: err => {
        this.error = err.error?.message || 'Operation failed';
        this.saving = false;
      }
    });
  }

  deleteCar(id: number) {
    if (!confirm('Delete this car listing?')) return;
    this.carService.deleteCar(id).subscribe(() => this.loadCars());
  }
}
