import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="auth-page">
      <div class="auth-card">
        <div class="auth-header">
          <h1>🚗 Join AutoDeal</h1>
          <p>Create your customer account to explore & apply for finance</p>
        </div>

        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label>Full Name</label>
            <input type="text" formControlName="name" placeholder="John Doe" />
            <span class="error" *ngIf="form.get('name')?.touched && form.get('name')?.invalid">Name is required</span>
          </div>
          <div class="form-group">
            <label>Email</label>
            <input type="email" formControlName="email" placeholder="you@example.com" />
            <span class="error" *ngIf="form.get('email')?.touched && form.get('email')?.invalid">Valid email required</span>
          </div>
          <div class="form-group">
            <label>Phone</label>
            <input type="text" formControlName="phone" placeholder="+91 9876543210" />
            <span class="error" *ngIf="form.get('phone')?.touched && form.get('phone')?.invalid">Phone is required</span>
          </div>
          <div class="form-group">
            <label>Password</label>
            <input type="password" formControlName="password" placeholder="Min. 6 characters" />
            <span class="error" *ngIf="form.get('password')?.touched && form.get('password')?.invalid">Min 6 characters required</span>
          </div>
          <button type="submit" class="btn-submit" [disabled]="loading">
            {{ loading ? 'Creating Account...' : 'Create Account' }}
          </button>
          <div class="error-msg" *ngIf="error">{{ error }}</div>
        </form>

        <div class="auth-footer">
          <p>Already have an account? <a routerLink="/login">Login here</a></p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-page {
      min-height: calc(100vh - 70px);
      display: flex; justify-content: center; align-items: center;
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
      padding: 2rem;
    }
    .auth-card {
      background: white; border-radius: 24px; padding: 2.5rem;
      width: 100%; max-width: 420px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
    }
    .auth-header { text-align: center; margin-bottom: 2rem; }
    .auth-header h1 { font-size: 1.8rem; font-weight: 800; color: #1a1a2e; }
    .auth-header p { color: #888; margin-top: 0.4rem; font-size: 0.9rem; }
    .form-group { margin-bottom: 1.1rem; }
    .form-group label { display: block; font-size: 0.85rem; font-weight: 600; color: #555; margin-bottom: 0.4rem; }
    .form-group input {
      width: 100%; padding: 0.8rem 1rem; border: 2px solid #e0e0e0;
      border-radius: 10px; font-size: 0.95rem; outline: none;
      box-sizing: border-box; transition: border 0.2s;
    }
    .form-group input:focus { border-color: #e94560; }
    .error { display: block; color: #e94560; font-size: 0.78rem; margin-top: 0.3rem; }
    .btn-submit {
      width: 100%; background: linear-gradient(135deg, #e94560, #c73652);
      color: white; border: none; padding: 0.9rem; border-radius: 12px;
      font-size: 1rem; font-weight: 700; cursor: pointer;
      transition: opacity 0.2s; margin-top: 0.5rem;
    }
    .btn-submit:hover { opacity: 0.9; }
    .btn-submit:disabled { opacity: 0.6; cursor: not-allowed; }
    .error-msg { color: #e94560; text-align: center; font-size: 0.9rem; margin-top: 1rem; }
    .auth-footer { text-align: center; margin-top: 1.5rem; color: #666; }
    .auth-footer a { color: #e94560; font-weight: 600; text-decoration: none; }
  `]
})
export class RegisterComponent {
  form;
  loading = false;
  error = '';

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true;
    this.error = '';
    this.auth.register(this.form.value).subscribe({
      next: () => { this.router.navigate(['/cars']); this.loading = false; },
      error: err => {
        this.error = err.error?.message || 'Registration failed. Email may already exist.';
        this.loading = false;
      }
    });
  }
}
