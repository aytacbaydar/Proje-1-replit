
import { Routes } from '@angular/router';

export const ADMIN_DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./admin-dashboard.component').then(m => m.AdminDashboardComponent)
  }
];
