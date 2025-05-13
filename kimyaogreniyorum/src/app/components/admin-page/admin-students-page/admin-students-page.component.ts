import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

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
    brans?: string;
    kayit_tarihi?: string;
    grubu?: string;
    ders_gunu?: string;
    ders_saati?: string;
    ucret?: string;
  };
}

@Component({
  selector: 'app-admin-students-page',
  templateUrl: './admin-students-page.component.html',
  styleUrls: ['./admin-students-page.component.scss'],
  standalone: true,
  imports: [CommonModule, HttpClientModule]
})
export class AdminStudentsPageComponent implements OnInit {
  students: User[] = [];
  teachers: User[] = [];
  newUsers: User[] = [];
  isLoading = true;
  activeTab: 'students' | 'teachers' | 'new' = 'students';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  setActiveTab(tab: 'students' | 'teachers' | 'new'): void {
    this.activeTab = tab;
  }

  loadUsers(): void {
    this.isLoading = true;

    // LocalStorage veya sessionStorage'dan token'ı al
    let token = '';
    const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      token = user.token || '';
    }

    // Tüm kullanıcıları getir
    this.http.get<any>('./server/api/admin.php', {
      headers: { 'Authorization': `Bearer ${token}` }
    }).subscribe({
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
        // Hata durumunda sadece loading durumunu güncelle
        this.isLoading = false;
      }
    });
  }
}