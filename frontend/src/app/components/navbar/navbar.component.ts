import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar">
      <div class="nav-brand">
        <a routerLink="/home">🚗 <span>AutoDeal</span></a>
      </div>
      <div class="nav-links">
        <a routerLink="/home" routerLinkActive="active">Home</a>
        <a routerLink="/cars" routerLinkActive="active">Cars</a>

        <ng-container *ngIf="!isLoggedIn">
          <a routerLink="/login" routerLinkActive="active">Login</a>
          <a routerLink="/register" class="btn-primary">Register</a>
        </ng-container>

        <ng-container *ngIf="isLoggedIn && role === 'ADMIN'">
          <a routerLink="/admin/vendors" routerLinkActive="active">Vendors</a>
        </ng-container>

        <ng-container *ngIf="isLoggedIn && role === 'VENDOR'">
          <a routerLink="/vendor/cars" routerLinkActive="active">My Cars</a>
        </ng-container>

        <ng-container *ngIf="isLoggedIn && role === 'USER'">
          <a routerLink="/user/dashboard" routerLinkActive="active">My Applications</a>
        </ng-container>

        <ng-container *ngIf="isLoggedIn">
          <span class="user-badge">{{ userName }} ({{ role }})</span>
          <button class="btn-logout" (click)="logout()">Logout</button>
        </ng-container>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 2rem;
      height: 70px;
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
      box-shadow: 0 2px 20px rgba(0,0,0,0.3);
      position: sticky;
      top: 0;
      z-index: 1000;
    }
    .nav-brand a {
      color: #e94560;
      font-size: 1.5rem;
      font-weight: 800;
      text-decoration: none;
      letter-spacing: -0.5px;
    }
    .nav-brand span { color: white; }
    .nav-links {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }
    .nav-links a {
      color: #ccc;
      text-decoration: none;
      font-weight: 500;
      transition: color 0.2s;
    }
    .nav-links a:hover, .nav-links a.active { color: #e94560; }
    .btn-primary {
      background: #e94560 !important;
      color: white !important;
      padding: 0.5rem 1.2rem;
      border-radius: 25px;
      font-weight: 600 !important;
    }
    .user-badge {
      color: #4ecdc4;
      font-size: 0.85rem;
      font-weight: 600;
      background: rgba(78,205,196,0.1);
      padding: 0.3rem 0.8rem;
      border-radius: 20px;
      border: 1px solid rgba(78,205,196,0.3);
    }
    .btn-logout {
      background: transparent;
      border: 1px solid #e94560;
      color: #e94560;
      padding: 0.4rem 1rem;
      border-radius: 20px;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.2s;
    }
    .btn-logout:hover {
      background: #e94560;
      color: white;
    }
  `]
})
export class NavbarComponent implements OnInit {
  isLoggedIn = false;
  role: string | null = null;
  userName: string | null = null;

  constructor(private auth: AuthService) {}

  ngOnInit() {
    this.auth.auth$.subscribe(user => {
      this.isLoggedIn = !!user;
      this.role = user?.role ?? null;
      this.userName = user?.name ?? null;
    });
  }

  logout() { this.auth.logout(); }
}
