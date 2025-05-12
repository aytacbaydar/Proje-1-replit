
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface User {
  id: number;
  adi_soyadi: string;
  email: string;
  cep_telefonu?: string;
  avatar?: string;
  rutbe: string;
  aktif: boolean;
  bilgiler?: {
    okulu?: string;
    sinifi?: string;
  };
}

@Component({
  selector: 'app-admin-students-page',
  templateUrl: './admin-students-page.component.html',
  styleUrls: ['./admin-students-page.component.scss'],
  standalone: false
})
export class AdminStudentsPageComponent implements OnInit {
  students: User[] = [];
  teachers: User[] = [];
  newUsers: User[] = [];
  isLoading = true;
  activeTab: 'students' | 'teachers' | 'new' = 'students';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  setActiveTab(tab: 'students' | 'teachers' | 'new'): void {
    this.activeTab = tab;
  }

  loadUsers(): void {
    this.isLoading = true;
    // Tüm kullanıcıları getir
    this.http.get<any>('/api/admin/students').subscribe({
      next: (response) => {
        if (response.success) {
          // Kullanıcıları rütbelerine göre filtrele
          this.students = response.data.filter((user: User) => user.rutbe === 'ogrenci');
          this.teachers = response.data.filter((user: User) => user.rutbe === 'ogretmen');
          this.newUsers = response.data.filter((user: User) => user.rutbe === 'yeni');
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Kullanıcılar yüklenirken hata oluştu:', error);
        this.isLoading = false;
      }
    });
  }
}
