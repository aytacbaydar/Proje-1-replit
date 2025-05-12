import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: false,
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  showPassword: boolean = false;
  submitted: boolean = false;
  isSubmitting: boolean = false;

  showToast: boolean = false;
  toastTitle: string = '';
  toastMessage: string = '';
  toastType: string = 'success'; // 'success' | 'error'

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      sifre: ['', [Validators.required]],
      remember: [false],
    });
  }

  // Getter for easy form field access
  get f() {
    return this.loginForm.controls;
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    this.submitted = true;

    // Stop if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.isSubmitting = true;

    // Prepare login data
    const loginData = {
      email: this.loginForm.value.email,
      sifre: this.loginForm.value.sifre,
    };

    console.log('Login isteği gönderiliyor:', loginData);

    // Send to server
    this.http.post<any>('./server/api/login.php', loginData).subscribe({
      next: (response) => {
        if (response.success) {
          this.showNotification(
            'Başarılı',
            'Giriş başarılı. Yönlendiriliyorsunuz...',
            'success'
          );

          // Store user info in localStorage if remember me is checked
          if (this.loginForm.value.remember) {
            localStorage.setItem('user', JSON.stringify(response.data));
          } else {
            sessionStorage.setItem('user', JSON.stringify(response.data));
          }

          // Navigate to appropriate page based on user role
          setTimeout(() => {
            const rutbe = response.data.rutbe;
            
            if (rutbe === 'admin') {
              this.router.navigate(['/admin']);
            } else if (rutbe === 'ogretmen') {
              this.router.navigate(['/teacher']);
            } else {
              this.router.navigate(['/student']);
            }
          }, 1500);
        } else {
          this.showNotification(
            'Hata',
            response.error || 'Giriş başarısız',
            'error'
          );
          this.isSubmitting = false;
        }
      },
      error: (error) => {
        let errorMsg = 'Beklenmeyen bir hata oluştu';

        if (error.error && error.error.error) {
          errorMsg = error.error.error;
        } else if (error.message) {
          errorMsg = error.message;
        }

        this.showNotification('Hata', errorMsg, 'error');
        console.error('Login error:', error);
        this.isSubmitting = false;
      },
    });
  }

  navigateToRegister(): void {
    this.router.navigate(['/register']);
  }

  showNotification(
    title: string,
    message: string,
    type: 'success' | 'error'
  ): void {
    this.toastTitle = title;
    this.toastMessage = message;
    this.toastType = type;
    this.showToast = true;

    // Auto-hide toast after 5 seconds
    setTimeout(() => {
      this.showToast = false;
    }, 5000);
  }
}
