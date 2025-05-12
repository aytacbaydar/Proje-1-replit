
import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

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

  constructor(private http: HttpClient) {}

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
        console.log('API Yanıtı:', response);
        if (response.success) {
          // Kullanıcıları rütbelerine göre filtrele
          this.students = response.data.filter((user: User) => user.rutbe === 'ogrenci');
          this.teachers = response.data.filter((user: User) => user.rutbe === 'ogretmen');
          this.newUsers = response.data.filter((user: User) => user.rutbe === 'yeni');
          
          // Her bir türden bir kullanıcı bilgisini detaylı göster
          if (this.students.length > 0) {
            console.log('Öğrenci Örneği:', this.students[0]);
          }
          if (this.teachers.length > 0) {
            console.log('Öğretmen Örneği:', this.teachers[0]);
          }
          if (this.newUsers.length > 0) {
            console.log('Yeni Kayıt Örneği:', this.newUsers[0]);
          }
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
