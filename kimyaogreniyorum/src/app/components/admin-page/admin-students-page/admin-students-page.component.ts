
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin-students-page',
  templateUrl: './admin-students-page.component.html',
  styleUrls: ['./admin-students-page.component.scss'],
  standalone: false
})
export class AdminStudentsPageComponent implements OnInit {
  students: any[] = [];
  isLoading = true;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadStudents();
  }

  loadStudents(): void {
    this.isLoading = true;
    // Sadece öğrenci rolündeki kullanıcıları getir
    this.http.get<any>('/api/admin/students').subscribe({
      next: (response) => {
        if (response.success) {
          // Öğrenci rolündekileri filtrele
          this.students = response.data.filter(student => student.rutbe === 'ogrenci');
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Öğrenciler yüklenirken hata oluştu:', error);
        this.isLoading = false;
      }
    });
  }
}
