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
    console.log('Admin sayfası başlatılıyor...');
    
    // LocalStorage ve sessionStorage'dan kullanıcı bilgilerini kontrol et
    let userStr = localStorage.getItem('user');
    
    if (!userStr) {
      console.log('LocalStorage\'da kullanıcı bulunamadı, sessionStorage kontrol ediliyor...');
      userStr = sessionStorage.getItem('user');
    }
    
    if (!userStr) {
      console.log('Kullanıcı bilgisi bulunamadı, login sayfasına yönlendiriliyor.');
      this.router.navigate(['/']);
      return;
    }

    try {
      console.log('Kullanıcı verisi:', userStr);
      const user = JSON.parse(userStr);
      console.log('Ayrıştırılmış kullanıcı:', user);
      
      // Kullanıcı admin değilse yönlendir
      if (user.rutbe !== 'admin') {
        console.log('Kullanıcı admin değil:', user.rutbe);
        this.router.navigate(['/']);
        return;
      }

      console.log('Admin kullanıcısı doğrulandı:', user);

      // Kullanıcı bilgilerini ayarla
      this.admin = {
        adi_soyadi: user.adi_soyadi || 'Admin',
        email: user.email || '',
        avatar: user.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.adi_soyadi || 'Admin') + '&background=random'
      };
      
      console.log('Admin bilgileri ayarlandı:', this.admin);
      this.isLoading = false;
    } catch (error) {
      console.error('Kullanıcı bilgileri ayrıştırılamadı:', error);
      this.router.navigate(['/']);
    }
  }

  toggleSidebar(): void {
    this.sidebarExpanded = !this.sidebarExpanded;
  }
}