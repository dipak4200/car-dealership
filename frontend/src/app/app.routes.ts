import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  // Public
  { path: 'home', loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent) },
  { path: 'cars', loadComponent: () => import('./components/car-list/car-list.component').then(m => m.CarListComponent) },
  { path: 'cars/:id', loadComponent: () => import('./components/car-detail/car-detail.component').then(m => m.CarDetailComponent) },
  { path: 'login', loadComponent: () => import('./components/auth/login/login.component').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./components/auth/register/register.component').then(m => m.RegisterComponent) },

  // Admin
  {
    path: 'admin',
    canActivate: [authGuard],
    data: { role: 'ADMIN' },
    children: [
      { path: 'vendors', loadComponent: () => import('./components/admin/vendors/vendors.component').then(m => m.VendorsComponent) },
      { path: '', redirectTo: 'vendors', pathMatch: 'full' }
    ]
  },

  // Vendor
  {
    path: 'vendor',
    canActivate: [authGuard],
    data: { role: 'VENDOR' },
    children: [
      { path: 'cars', loadComponent: () => import('./components/vendor/vendor-cars/vendor-cars.component').then(m => m.VendorCarsComponent) },
      { path: '', redirectTo: 'cars', pathMatch: 'full' }
    ]
  },

  // User
  {
    path: 'user',
    canActivate: [authGuard],
    data: { role: 'USER' },
    children: [
      { path: 'dashboard', loadComponent: () => import('./components/user/user-dashboard/user-dashboard.component').then(m => m.UserDashboardComponent) },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  { path: '**', redirectTo: 'home' }
];
