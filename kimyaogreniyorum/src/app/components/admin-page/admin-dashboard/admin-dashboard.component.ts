
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-container">
      <div class="page-header">
        <h1>Dashboard</h1>
        <p>Hoş Geldiniz, Yönetici</p>
      </div>
      
      <div class="dashboard-stats">
        <div class="stat-card">
          <div class="stat-icon student-icon">
            <i class="bi bi-people"></i>
          </div>
          <div class="stat-info">
            <span class="stat-value">150</span>
            <span class="stat-label">Öğrenci</span>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon teacher-icon">
            <i class="bi bi-person-video3"></i>
          </div>
          <div class="stat-info">
            <span class="stat-value">12</span>
            <span class="stat-label">Öğretmen</span>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon course-icon">
            <i class="bi bi-book"></i>
          </div>
          <div class="stat-info">
            <span class="stat-value">24</span>
            <span class="stat-label">Ders</span>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon revenue-icon">
            <i class="bi bi-graph-up"></i>
          </div>
          <div class="stat-info">
            <span class="stat-value">85%</span>
            <span class="stat-label">Başarı Oranı</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 20px;
    }
    
    .page-header {
      margin-bottom: 24px;
      
      h1 {
        margin: 0;
        font-size: 24px;
        font-weight: 600;
      }
      
      p {
        margin: 8px 0 0;
        color: #6e707e;
      }
    }
    
    .dashboard-stats {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      gap: 24px;
    }
    
    .stat-card {
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
      padding: 24px;
      display: flex;
      align-items: center;
    }
    
    .stat-icon {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 16px;
      
      i {
        font-size: 24px;
        color: white;
      }
    }
    
    .student-icon {
      background-color: #4e73df;
    }
    
    .teacher-icon {
      background-color: #1cc88a;
    }
    
    .course-icon {
      background-color: #36b9cc;
    }
    
    .revenue-icon {
      background-color: #f6c23e;
    }
    
    .stat-info {
      display: flex;
      flex-direction: column;
    }
    
    .stat-value {
      font-size: 24px;
      font-weight: 700;
      color: #5a5c69;
    }
    
    .stat-label {
      font-size: 14px;
      color: #858796;
      margin-top: 4px;
    }
  `]
})
export class AdminDashboardComponent {}
