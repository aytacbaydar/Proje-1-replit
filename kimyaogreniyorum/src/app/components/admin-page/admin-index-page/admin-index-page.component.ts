import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-index-page',
  standalone: false,
  templateUrl: './admin-index-page.component.html',
  styleUrl: './admin-index-page.component.scss',
})
export class AdminIndexPageComponent implements OnInit {
  sidebarExpanded = true;
  admin = {
    adi_soyadi: '',
    email: '',
    avatar: ''
  };
  isLoading = true;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    // LocalStorage ve sessionStorage'dan kullanıcı bilgilerini kontrol et
    let userStr = localStorage.getItem('user');
    
    if (!userStr) {
      userStr = sessionStorage.getItem('user');
    }
    
    if (!userStr) {
      this.router.navigate(['/']);
      return;
    }

    try {
      const user = JSON.parse(userStr);
      
      // Kullanıcı admin değilse yönlendir
      if (user.rutbe !== 'admin') {
        this.router.navigate(['/']);
        return;
      }

      // Kullanıcı bilgilerini ayarla
      this.admin = {
        adi_soyadi: user.adi_soyadi || 'Admin',
        email: user.email || '',
        avatar: user.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.adi_soyadi || 'Admin') + '&background=random'
      };
      
      this.isLoading = false;
    } catch (error) {
      this.router.navigate(['/']);
    }
  }

  toggleSidebar(): void {
    this.sidebarExpanded = !this.sidebarExpanded;
  }
}