
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
    this.http.get<any>('/api/students').subscribe({
      next: (response) => {
        if (response.success) {
          this.students = response.data;
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
