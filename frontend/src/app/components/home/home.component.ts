import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CarService } from '../../services/car.service';
import { Car } from '../../models/models';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="hero">
      <div class="hero-content">
        <h1>Find Your <span>Dream Car</span></h1>
        <p>Browse thousands of quality vehicles from trusted dealers. Get the best deal with our easy finance calculator.</p>
        <div class="hero-actions">
          <a routerLink="/cars" class="btn-primary">Browse Cars</a>
          <a routerLink="/register" class="btn-outline">Get Started</a>
        </div>
      </div>
      <div class="hero-stats">
        <div class="stat"><span>{{ cars.length }}+</span><label>Cars Listed</label></div>
        <div class="stat"><span>100%</span><label>Verified Dealers</label></div>
        <div class="stat"><span>EMI</span><label>Finance Available</label></div>
      </div>
    </section>

    <section class="featured">
      <h2>Featured Cars</h2>
      <div class="car-grid">
        <div class="car-card" *ngFor="let car of featuredCars" [routerLink]="['/cars', car.id]">
          <div class="car-img">
            <img [src]="car.imageUrl || 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=400'" [alt]="car.title" />
            <span class="badge" *ngIf="car.available">Available</span>
          </div>
          <div class="car-info">
            <h3>{{ car.title }}</h3>
            <p class="car-meta">{{ car.year }} · {{ car.transmission }} · {{ car.fuelType }}</p>
            <div class="car-footer">
              <span class="price">₹{{ car.price | number }}</span>
              <a [routerLink]="['/cars', car.id]" class="btn-sm">View Details</a>
            </div>
          </div>
        </div>
      </div>
      <div class="view-all" *ngIf="cars.length > 6">
        <a routerLink="/cars" class="btn-outline">View All Cars →</a>
      </div>
    </section>

    <section class="features">
      <div class="feature">
        <div class="icon">🔒</div>
        <h3>Verified Dealers</h3>
        <p>All vendors are verified by our admin team ensuring trust and quality.</p>
      </div>
      <div class="feature">
        <div class="icon">💰</div>
        <h3>Easy Finance</h3>
        <p>Calculate your monthly EMI instantly and apply for car finance online.</p>
      </div>
      <div class="feature">
        <div class="icon">🚗</div>
        <h3>Wide Selection</h3>
        <p>Choose from hundreds of cars across all makes, models and price ranges.</p>
      </div>
    </section>
  `,
  styles: [`
    .hero {
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
      color: white;
      padding: 5rem 4rem 3rem;
    }
    .hero-content h1 { font-size: 3.5rem; font-weight: 800; margin-bottom: 1rem; }
    .hero-content h1 span { color: #e94560; }
    .hero-content p { font-size: 1.2rem; color: #ccc; margin-bottom: 2rem; max-width: 600px; }
    .hero-actions { display: flex; gap: 1rem; flex-wrap: wrap; }
    .btn-primary {
      background: #e94560; color: white; padding: 0.9rem 2.5rem;
      border-radius: 50px; text-decoration: none; font-weight: 700; font-size: 1rem;
      transition: transform 0.2s, box-shadow 0.2s;
      box-shadow: 0 4px 20px rgba(233,69,96,0.4);
    }
    .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(233,69,96,0.5); }
    .btn-outline {
      border: 2px solid white; color: white; padding: 0.9rem 2.5rem;
      border-radius: 50px; text-decoration: none; font-weight: 700; font-size: 1rem;
      transition: all 0.2s;
    }
    .btn-outline:hover { background: white; color: #1a1a2e; }
    .hero-stats {
      display: flex; gap: 3rem; margin-top: 3rem; padding-top: 3rem;
      border-top: 1px solid rgba(255,255,255,0.1);
    }
    .stat span { font-size: 2.5rem; font-weight: 800; color: #e94560; display: block; }
    .stat label { color: #aaa; font-size: 0.9rem; }
    .featured {
      padding: 4rem;
      background: #f8f9fa;
    }
    .featured h2 {
      font-size: 2rem; font-weight: 800; margin-bottom: 2rem;
      color: #1a1a2e; text-align: center;
    }
    .car-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
    }
    .car-card {
      background: white; border-radius: 16px; overflow: hidden;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
      transition: transform 0.2s, box-shadow 0.2s;
      cursor: pointer;
    }
    .car-card:hover { transform: translateY(-5px); box-shadow: 0 10px 40px rgba(0,0,0,0.15); }
    .car-img { position: relative; height: 200px; overflow: hidden; }
    .car-img img { width: 100%; height: 100%; object-fit: cover; }
    .badge {
      position: absolute; top: 12px; left: 12px;
      background: #4ecdc4; color: white;
      padding: 0.2rem 0.8rem; border-radius: 20px; font-size: 0.78rem; font-weight: 700;
    }
    .car-info { padding: 1.2rem; }
    .car-info h3 { font-size: 1.1rem; font-weight: 700; color: #1a1a2e; margin-bottom: 0.4rem; }
    .car-meta { color: #888; font-size: 0.85rem; margin-bottom: 1rem; }
    .car-footer { display: flex; justify-content: space-between; align-items: center; }
    .price { font-size: 1.3rem; font-weight: 800; color: #e94560; }
    .btn-sm {
      background: #1a1a2e; color: white; padding: 0.5rem 1.2rem;
      border-radius: 20px; text-decoration: none; font-size: 0.85rem;
      transition: background 0.2s;
    }
    .btn-sm:hover { background: #e94560; }
    .view-all { text-align: center; margin-top: 2rem; }
    .features {
      display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem;
      padding: 4rem; background: white;
    }
    .feature { text-align: center; padding: 2rem; }
    .feature .icon { font-size: 3rem; margin-bottom: 1rem; }
    .feature h3 { font-size: 1.2rem; font-weight: 700; color: #1a1a2e; margin-bottom: 0.5rem; }
    .feature p { color: #666; line-height: 1.6; }
    @media (max-width: 768px) {
      .hero { padding: 3rem 1.5rem; }
      .hero-content h1 { font-size: 2.2rem; }
      .hero-stats { flex-wrap: wrap; gap: 1.5rem; }
      .features { grid-template-columns: 1fr; padding: 2rem 1.5rem; }
      .featured { padding: 2rem 1.5rem; }
    }
  `]
})
export class HomeComponent implements OnInit {
  cars: Car[] = [];
  get featuredCars() { return this.cars.slice(0, 6); }

  constructor(private carService: CarService) {}

  ngOnInit() {
    this.carService.getAllCars().subscribe({
      next: cars => this.cars = cars,
      error: () => this.cars = []
    });
  }
}
