import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AdminService } from '../../../services/admin.service';
import { User } from '../../../models/models';

@Component({
  selector: 'app-vendors',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="page">
      <div class="page-header">
        <div>
          <h1>Vendor Management</h1>
          <p>Add and manage car dealership vendors</p>
        </div>
      </div>

      <!-- Add Vendor Form -->
      <div class="card">
        <h2>➕ Add New Vendor</h2>
        <form [formGroup]="form" (ngSubmit)="addVendor()" class="form-grid">
          <div class="form-group">
            <label>Full Name</label>
            <input type="text" formControlName="name" placeholder="Vendor name" />
          </div>
          <div class="form-group">
            <label>Email</label>
            <input type="email" formControlName="email" placeholder="vendor@example.com" />
          </div>
          <div class="form-group">
            <label>Phone</label>
            <input type="text" formControlName="phone" placeholder="+91 9999999999" />
          </div>
          <div class="form-group">
            <label>Password</label>
            <input type="password" formControlName="password" placeholder="Min 6 characters" />
          </div>
          <div class="form-submit">
            <button type="submit" [disabled]="loading">{{ loading ? 'Adding...' : 'Add Vendor' }}</button>
          </div>
        </form>
        <div class="success" *ngIf="successMsg">✅ {{ successMsg }}</div>
        <div class="error" *ngIf="error">❌ {{ error }}</div>
      </div>

      <!-- Vendors Table -->
      <div class="card">
        <h2>👥 All Vendors ({{ vendors.length }})</h2>
        <table *ngIf="vendors.length > 0">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let v of vendors; let i = index">
              <td>{{ i + 1 }}</td>
              <td><strong>{{ v.name }}</strong></td>
              <td>{{ v.email }}</td>
              <td>{{ v.phone }}</td>
              <td>
                <span class="badge" [class.active]="v.enabled" [class.inactive]="!v.enabled">
                  {{ v.enabled ? 'Active' : 'Inactive' }}
                </span>
              </td>
              <td>
                <button class="btn-toggle" (click)="toggle(v)">
                  {{ v.enabled ? 'Deactivate' : 'Activate' }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <p class="empty" *ngIf="vendors.length === 0">No vendors added yet.</p>
      </div>
    </div>
  `,
  styles: [`
    .page { padding: 2rem 3rem; background: #f8f9fa; min-height: calc(100vh - 70px); }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
    .page-header h1 { font-size: 2rem; font-weight: 800; color: #1a1a2e; }
    .page-header p { color: #888; margin-top: 0.3rem; }
    .card { background: white; border-radius: 16px; padding: 2rem; margin-bottom: 2rem; box-shadow: 0 4px 20px rgba(0,0,0,0.06); }
    .card h2 { font-size: 1.2rem; font-weight: 700; color: #1a1a2e; margin-bottom: 1.5rem; }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .form-group { display: flex; flex-direction: column; }
    .form-group label { font-size: 0.85rem; font-weight: 600; color: #555; margin-bottom: 0.4rem; }
    .form-group input {
      padding: 0.75rem 1rem; border: 2px solid #e0e0e0; border-radius: 10px;
      font-size: 0.95rem; outline: none; transition: border 0.2s;
    }
    .form-group input:focus { border-color: #e94560; }
    .form-submit { grid-column: 1 / -1; }
    .form-submit button {
      background: #e94560; color: white; border: none; padding: 0.8rem 2rem;
      border-radius: 10px; font-weight: 700; font-size: 0.95rem; cursor: pointer;
    }
    .form-submit button:disabled { opacity: 0.6; }
    .success { color: #4ecdc4; font-weight: 600; margin-top: 1rem; }
    .error { color: #e94560; font-weight: 600; margin-top: 1rem; }
    table { width: 100%; border-collapse: collapse; }
    th { background: #1a1a2e; color: white; padding: 0.9rem 1rem; text-align: left; font-size: 0.85rem; }
    td { padding: 0.9rem 1rem; border-bottom: 1px solid #f0f0f0; font-size: 0.9rem; }
    .badge {
      padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.78rem; font-weight: 700;
    }
    .badge.active { background: rgba(78,205,196,0.15); color: #4ecdc4; }
    .badge.inactive { background: rgba(233,69,96,0.12); color: #e94560; }
    .btn-toggle {
      background: transparent; border: 1px solid #1a1a2e; color: #1a1a2e;
      padding: 0.35rem 0.9rem; border-radius: 8px; cursor: pointer; font-size: 0.82rem;
      transition: all 0.2s;
    }
    .btn-toggle:hover { background: #1a1a2e; color: white; }
    .empty { text-align: center; color: #888; padding: 2rem; }
    @media (max-width: 768px) { .page { padding: 1.5rem 1rem; } .form-grid { grid-template-columns: 1fr; } }
  `]
})
export class VendorsComponent implements OnInit {
  vendors: User[] = [];
  form;
  loading = false;
  successMsg = '';
  error = '';

  constructor(private adminService: AdminService, private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit() { this.loadVendors(); }

  loadVendors() {
    this.adminService.getAllVendors().subscribe(v => this.vendors = v);
  }

  addVendor() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true;
    this.successMsg = '';
    this.error = '';
    this.adminService.addVendor(this.form.value).subscribe({
      next: () => {
        this.successMsg = 'Vendor added successfully!';
        this.form.reset();
        this.loading = false;
        this.loadVendors();
      },
      error: err => {
        this.error = err.error?.message || 'Failed to add vendor';
        this.loading = false;
      }
    });
  }

  toggle(vendor: User) {
    this.adminService.toggleVendor(vendor.id).subscribe(updated => {
      const idx = this.vendors.findIndex(v => v.id === vendor.id);
      if (idx !== -1) this.vendors[idx] = updated;
    });
  }
}
