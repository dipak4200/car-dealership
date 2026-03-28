import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CarService } from '../../services/car.service';
import { FinanceService } from '../../services/finance.service';
import { AuthService } from '../../services/auth.service';
import { Car, FinanceCalculation } from '../../models/models';

@Component({
  selector: 'app-car-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="page" *ngIf="car">
      <div class="car-detail-grid">
        <!-- Left: Car Image & Info -->
        <div class="car-main">
          <div class="car-img-wrapper">
            <img [src]="car.imageUrl || 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800'" [alt]="car.title" />
          </div>
          <div class="car-header">
            <div>
              <h1>{{ car.title }}</h1>
              <p class="vendor-tag">Listed by: <strong>{{ car.vendor?.name }}</strong></p>
            </div>
            <span class="price-tag">₹{{ car.price | number }}</span>
          </div>

          <div class="specs-grid">
            <div class="spec"><span class="label">Year</span><span class="val">{{ car.year }}</span></div>
            <div class="spec"><span class="label">Make</span><span class="val">{{ car.make }}</span></div>
            <div class="spec"><span class="label">Model</span><span class="val">{{ car.model }}</span></div>
            <div class="spec"><span class="label">Fuel Type</span><span class="val">{{ car.fuelType }}</span></div>
            <div class="spec"><span class="label">Transmission</span><span class="val">{{ car.transmission }}</span></div>
            <div class="spec"><span class="label">Mileage</span><span class="val">{{ car.mileage | number }} km</span></div>
            <div class="spec"><span class="label">Color</span><span class="val">{{ car.color }}</span></div>
            <div class="spec"><span class="label">Status</span>
              <span class="val" [class.available]="car.available">{{ car.available ? 'Available' : 'Sold' }}</span>
            </div>
          </div>

          <div class="description" *ngIf="car.description">
            <h3>Description</h3>
            <p>{{ car.description }}</p>
          </div>
        </div>

        <!-- Right: Finance Calculator -->
        <div class="finance-panel">
          <h2>💰 Finance Calculator</h2>
          <p class="finance-sub">Calculate your monthly EMI instantly</p>

          <div class="form-group">
            <label>Car Price (₹)</label>
            <input type="number" [(ngModel)]="finCalc.carPrice" [value]="car.price" />
          </div>
          <div class="form-group">
            <label>Down Payment (₹)</label>
            <input type="number" [(ngModel)]="finCalc.downPayment" min="0" />
          </div>
          <div class="form-group">
            <label>Annual Interest Rate (%)</label>
            <input type="number" [(ngModel)]="finCalc.annualInterestRate" min="1" max="30" step="0.1" />
          </div>
          <div class="form-group">
            <label>Loan Term (months)</label>
            <select [(ngModel)]="finCalc.termMonths">
              <option value="12">12 months (1 yr)</option>
              <option value="24">24 months (2 yr)</option>
              <option value="36">36 months (3 yr)</option>
              <option value="48">48 months (4 yr)</option>
              <option value="60">60 months (5 yr)</option>
              <option value="72">72 months (6 yr)</option>
              <option value="84">84 months (7 yr)</option>
            </select>
          </div>

          <button class="btn-calc" (click)="calculate()" [disabled]="calculating">
            {{ calculating ? 'Calculating...' : '📊 Calculate EMI' }}
          </button>

          <div class="calc-result" *ngIf="result">
            <div class="result-row highlight">
              <span>Monthly EMI</span>
              <strong>₹{{ result.monthlyPayment | number:'1.2-2' }}</strong>
            </div>
            <div class="result-row">
              <span>Loan Amount</span>
              <span>₹{{ result.loanAmount | number:'1.2-2' }}</span>
            </div>
            <div class="result-row">
              <span>Total Payment</span>
              <span>₹{{ result.totalPayment | number:'1.2-2' }}</span>
            </div>
            <div class="result-row">
              <span>Total Interest</span>
              <span>₹{{ result.totalInterest | number:'1.2-2' }}</span>
            </div>
          </div>

          <div class="apply-section" *ngIf="result">
            <ng-container *ngIf="isUserLoggedIn">
              <button class="btn-apply" (click)="applyFinance()" [disabled]="applying">
                {{ applying ? 'Submitting...' : '🚗 Apply for Finance' }}
              </button>
              <p class="success-msg" *ngIf="applied">✅ Finance application submitted successfully!</p>
            </ng-container>
            <ng-container *ngIf="!isUserLoggedIn">
              <a routerLink="/login" class="btn-apply-link">Login to Apply for Finance</a>
            </ng-container>
          </div>
        </div>
      </div>
    </div>

    <div class="loading-page" *ngIf="!car">
      <p>Loading car details...</p>
    </div>
  `,
  styles: [`
    .page { padding: 2rem 3rem; background: #f8f9fa; min-height: calc(100vh - 70px); }
    .car-detail-grid { display: grid; grid-template-columns: 1fr 400px; gap: 2rem; max-width: 1300px; margin: 0 auto; }
    .car-img-wrapper { border-radius: 16px; overflow: hidden; margin-bottom: 1.5rem; height: 400px; }
    .car-img-wrapper img { width: 100%; height: 100%; object-fit: cover; }
    .car-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.5rem; }
    .car-header h1 { font-size: 1.8rem; font-weight: 800; color: #1a1a2e; }
    .vendor-tag { color: #888; font-size: 0.9rem; margin-top: 0.3rem; }
    .price-tag { font-size: 2rem; font-weight: 800; color: #e94560; white-space: nowrap; }
    .specs-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 1.5rem; }
    .spec { background: white; border-radius: 12px; padding: 1rem; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
    .spec .label { display: block; font-size: 0.75rem; color: #888; text-transform: uppercase; letter-spacing: 0.5px; }
    .spec .val { display: block; font-weight: 700; color: #1a1a2e; font-size: 0.95rem; margin-top: 0.3rem; }
    .spec .val.available { color: #4ecdc4; }
    .description { background: white; border-radius: 12px; padding: 1.5rem; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
    .description h3 { font-size: 1.1rem; font-weight: 700; color: #1a1a2e; margin-bottom: 0.8rem; }
    .description p { color: #555; line-height: 1.7; }
    .finance-panel {
      background: white; border-radius: 20px; padding: 2rem;
      box-shadow: 0 8px 40px rgba(0,0,0,0.12);
      height: fit-content; position: sticky; top: 90px;
    }
    .finance-panel h2 { font-size: 1.4rem; font-weight: 800; color: #1a1a2e; margin-bottom: 0.3rem; }
    .finance-sub { color: #888; font-size: 0.9rem; margin-bottom: 1.5rem; }
    .form-group { margin-bottom: 1rem; }
    .form-group label { display: block; font-size: 0.85rem; font-weight: 600; color: #555; margin-bottom: 0.4rem; }
    .form-group input, .form-group select {
      width: 100%; padding: 0.7rem 1rem; border: 2px solid #e0e0e0;
      border-radius: 10px; font-size: 0.95rem; outline: none;
      transition: border 0.2s; box-sizing: border-box;
    }
    .form-group input:focus, .form-group select:focus { border-color: #e94560; }
    .btn-calc {
      width: 100%; background: linear-gradient(135deg, #1a1a2e, #0f3460);
      color: white; border: none; padding: 0.9rem; border-radius: 12px;
      font-size: 1rem; font-weight: 700; cursor: pointer;
      transition: opacity 0.2s; margin-bottom: 1.5rem;
    }
    .btn-calc:hover { opacity: 0.9; }
    .btn-calc:disabled { opacity: 0.6; cursor: not-allowed; }
    .calc-result {
      background: #f8f9fa; border-radius: 12px; overflow: hidden;
      border: 1px solid #eee; margin-bottom: 1.5rem;
    }
    .result-row {
      display: flex; justify-content: space-between; padding: 0.8rem 1rem;
      border-bottom: 1px solid #eee; font-size: 0.9rem;
    }
    .result-row:last-child { border-bottom: none; }
    .result-row.highlight { background: #1a1a2e; color: white; }
    .result-row.highlight strong { font-size: 1.2rem; color: #e94560; }
    .btn-apply {
      width: 100%; background: #e94560; color: white; border: none;
      padding: 0.9rem; border-radius: 12px; font-size: 1rem;
      font-weight: 700; cursor: pointer; transition: background 0.2s;
    }
    .btn-apply:hover { background: #c73652; }
    .btn-apply:disabled { opacity: 0.6; cursor: not-allowed; }
    .btn-apply-link {
      display: block; text-align: center; width: 100%;
      background: transparent; color: #e94560; border: 2px solid #e94560;
      padding: 0.8rem; border-radius: 12px; font-weight: 700;
      text-decoration: none; transition: all 0.2s; box-sizing: border-box;
    }
    .btn-apply-link:hover { background: #e94560; color: white; }
    .success-msg { text-align: center; color: #4ecdc4; font-weight: 600; margin-top: 0.8rem; }
    .loading-page { display: flex; justify-content: center; align-items: center; height: 300px; color: #888; }
    @media (max-width: 900px) {
      .car-detail-grid { grid-template-columns: 1fr; }
      .specs-grid { grid-template-columns: repeat(2, 1fr); }
      .page { padding: 1.5rem 1rem; }
    }
  `]
})
export class CarDetailComponent implements OnInit {
  car: Car | null = null;
  result: FinanceCalculation | null = null;
  calculating = false;
  applying = false;
  applied = false;
  isUserLoggedIn = false;

  finCalc = {
    carPrice: 0,
    downPayment: 0,
    annualInterestRate: 8.5,
    termMonths: 36
  };

  constructor(
    private route: ActivatedRoute,
    private carService: CarService,
    private financeService: FinanceService,
    private auth: AuthService
  ) {}

  ngOnInit() {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.carService.getCarById(id).subscribe(car => {
      this.car = car;
      this.finCalc.carPrice = car.price;
    });

    this.isUserLoggedIn = this.auth.isLoggedIn() && this.auth.getRole() === 'USER';
  }

  calculate() {
    this.calculating = true;
    this.financeService.calculate(this.finCalc).subscribe({
      next: res => { this.result = res; this.calculating = false; },
      error: () => this.calculating = false
    });
  }

  applyFinance() {
    if (!this.result || !this.car) return;
    this.applying = true;
    this.financeService.apply({
      carId: this.car.id,
      carPrice: this.finCalc.carPrice,
      downPayment: this.finCalc.downPayment,
      annualInterestRate: this.finCalc.annualInterestRate,
      termMonths: this.finCalc.termMonths,
      monthlyPayment: this.result.monthlyPayment
    }).subscribe({
      next: () => { this.applied = true; this.applying = false; },
      error: () => this.applying = false
    });
  }
}
