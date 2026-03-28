import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FinanceService } from '../../../services/finance.service';
import { AuthService } from '../../../services/auth.service';
import { FinanceRequest } from '../../../models/models';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="page">
      <div class="page-header">
        <h1>My Finance Applications</h1>
        <p>Welcome back, <strong>{{ userName }}</strong> — Track your car finance applications</p>
      </div>

      <div class="summary-row">
        <div class="summary-card total">
          <span class="num">{{ requests.length }}</span>
          <span class="label">Total Applications</span>
        </div>
        <div class="summary-card pending">
          <span class="num">{{ countStatus('PENDING') }}</span>
          <span class="label">Pending</span>
        </div>
        <div class="summary-card approved">
          <span class="num">{{ countStatus('APPROVED') }}</span>
          <span class="label">Approved</span>
        </div>
        <div class="summary-card rejected">
          <span class="num">{{ countStatus('REJECTED') }}</span>
          <span class="label">Rejected</span>
        </div>
      </div>

      <div class="card">
        <h2>Finance Applications</h2>
        <div *ngIf="loading" class="loading">Loading...</div>
        <table *ngIf="!loading && requests.length > 0">
          <thead>
            <tr>
              <th>Car</th>
              <th>Car Price</th>
              <th>Down Payment</th>
              <th>Loan Amount</th>
              <th>Term</th>
              <th>Interest Rate</th>
              <th>Monthly EMI</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let r of requests">
              <td><strong>{{ r.car?.title }}</strong><br/><small>{{ r.car?.make }} {{ r.car?.model }}</small></td>
              <td>₹{{ r.carPrice | number:'1.2-2' }}</td>
              <td>₹{{ r.downPayment | number:'1.2-2' }}</td>
              <td>₹{{ r.loanAmount | number:'1.2-2' }}</td>
              <td>{{ r.termMonths }} months</td>
              <td>{{ r.annualInterestRate }}%</td>
              <td class="emi">₹{{ r.monthlyPayment | number:'1.2-2' }}</td>
              <td>
                <span class="badge" [class]="r.status.toLowerCase()">{{ r.status }}</span>
              </td>
              <td>{{ r.createdAt | date:'dd MMM yyyy' }}</td>
            </tr>
          </tbody>
        </table>
        <div class="empty" *ngIf="!loading && requests.length === 0">
          <p>No finance applications yet.</p>
          <a routerLink="/cars" class="btn-browse">Browse Cars & Apply →</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page { padding: 2rem 3rem; background: #f8f9fa; min-height: calc(100vh - 70px); }
    .page-header { margin-bottom: 2rem; }
    .page-header h1 { font-size: 2rem; font-weight: 800; color: #1a1a2e; }
    .page-header p { color: #888; margin-top: 0.3rem; }
    .summary-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 2rem; }
    .summary-card {
      background: white; border-radius: 16px; padding: 1.5rem; text-align: center;
      box-shadow: 0 4px 20px rgba(0,0,0,0.06);
    }
    .summary-card .num { display: block; font-size: 2.5rem; font-weight: 800; }
    .summary-card .label { color: #888; font-size: 0.85rem; }
    .summary-card.total .num { color: #1a1a2e; }
    .summary-card.pending .num { color: #f59e0b; }
    .summary-card.approved .num { color: #4ecdc4; }
    .summary-card.rejected .num { color: #e94560; }
    .card { background: white; border-radius: 16px; padding: 2rem; box-shadow: 0 4px 20px rgba(0,0,0,0.06); }
    .card h2 { font-size: 1.2rem; font-weight: 700; color: #1a1a2e; margin-bottom: 1.5rem; }
    table { width: 100%; border-collapse: collapse; overflow-x: auto; display: block; }
    th { background: #1a1a2e; color: white; padding: 0.9rem 1rem; text-align: left; font-size: 0.82rem; white-space: nowrap; }
    td { padding: 0.9rem 1rem; border-bottom: 1px solid #f0f0f0; font-size: 0.88rem; white-space: nowrap; }
    td small { color: #888; font-size: 0.78rem; }
    .emi { font-weight: 700; color: #e94560; }
    .badge { padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.78rem; font-weight: 700; }
    .badge.pending { background: rgba(245,158,11,0.15); color: #f59e0b; }
    .badge.approved { background: rgba(78,205,196,0.15); color: #4ecdc4; }
    .badge.rejected { background: rgba(233,69,96,0.12); color: #e94560; }
    .loading, .empty { text-align: center; padding: 3rem; color: #888; }
    .btn-browse {
      display: inline-block; background: #e94560; color: white;
      padding: 0.7rem 1.5rem; border-radius: 20px; text-decoration: none;
      font-weight: 600; margin-top: 1rem;
    }
    @media (max-width: 768px) {
      .page { padding: 1.5rem 1rem; }
      .summary-row { grid-template-columns: 1fr 1fr; }
    }
  `]
})
export class UserDashboardComponent implements OnInit {
  requests: FinanceRequest[] = [];
  loading = true;
  userName = '';

  constructor(private financeService: FinanceService, private auth: AuthService) {}

  ngOnInit() {
    this.userName = this.auth.getUser()?.name ?? 'User';
    this.financeService.getMyRequests().subscribe({
      next: reqs => { this.requests = reqs; this.loading = false; },
      error: () => this.loading = false
    });
  }

  countStatus(status: string) {
    return this.requests.filter(r => r.status === status).length;
  }
}
