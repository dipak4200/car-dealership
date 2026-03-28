export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: 'ADMIN' | 'VENDOR' | 'USER';
  enabled: boolean;
}

export interface Car {
  id: number;
  title: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuelType: string;
  transmission: string;
  color: string;
  description: string;
  imageUrl: string;
  available: boolean;
  vendor: User;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  role: string;
  name: string;
  userId: number;
}

export interface FinanceCalculation {
  loanAmount: number;
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
}

export interface FinanceRequest {
  id: number;
  car: Car;
  carPrice: number;
  downPayment: number;
  loanAmount: number;
  termMonths: number;
  annualInterestRate: number;
  monthlyPayment: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
}
