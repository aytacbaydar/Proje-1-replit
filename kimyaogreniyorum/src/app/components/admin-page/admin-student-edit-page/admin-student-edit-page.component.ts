import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-student-edit-page',
  standalone: true,
  imports: [CommonModule, HttpClientModule, ReactiveFormsModule, FormsModule, RouterModule],
  templateUrl: './admin-student-edit-page.component.html',
  styleUrl: './admin-student-edit-page.component.scss'
})
export class AdminStudentEditPageComponent implements OnInit {
  studentId: number = 0;
  student: any = null;
  editForm!: FormGroup;
  isLoading: boolean = true;
  isSubmitting: boolean = false;
  error: string | null = null;
  success: string | null = null;
  selectedFile: File | null = null;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.initForm();

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.studentId = +id;
        this.loadStudentData();
      } else {
        this.isLoading = false;
        this.error = 'Öğrenci ID bulunamadı.';
      }
    });
  }

  initForm(): void {
    this.editForm = this.fb.group({
      // Temel bilgiler
      adi_soyadi: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      cep_telefonu: [''],
      aktif: [true],
      sifre: [''],
      sifre_tekrar: [''],

      // Eğitim bilgileri
      okulu: [''],
      sinifi: [''],
      grubu: [''],
      ders_gunu: [''],
      ders_saati: [''],
      ucret: [''],

      // Veli bilgileri
      veli_adi: [''],
      veli_cep: ['']
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('sifre');
    const confirmPassword = control.get('sifre_tekrar');

    if (password && confirmPassword && password.value && password.value !== confirmPassword.value) {
      return { 'passwordMismatch': true };
    }

    return null;
  }

  loadStudentData(): void {
    this.isLoading = true;
    this.error = null;

    // LocalStorage veya sessionStorage'dan token'ı al
    let token = '';
    const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      token = user.token || '';
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.http.get<any>(`./server/api/student.php?id=${this.studentId}`, { headers }).subscribe({
      next: (response) => {
        if (response.success) {
          this.student = response.data;

          // Form'u doldur
          this.editForm.patchValue({
            // Temel bilgiler
            adi_soyadi: this.student.adi_soyadi || '',
            email: this.student.email || '',
            cep_telefonu: this.student.cep_telefonu || '',
            aktif: this.student.aktif || false,

            // Eğitim bilgileri
            okulu: this.student.bilgiler?.okulu || '',
            sinifi: this.student.bilgiler?.sinifi || '',
            grubu: this.student.bilgiler?.grubu || '',
            ders_gunu: this.student.bilgiler?.ders_gunu || '',
            ders_saati: this.student.bilgiler?.ders_saati || '',
            ucret: this.student.bilgiler?.ucret || '',

            // Veli bilgileri
            veli_adi: this.student.bilgiler?.veli_adi || '',
            veli_cep: this.student.bilgiler?.veli_cep || ''
          });

          this.isLoading = false;
        } else {
          this.isLoading = false;
          this.error = response.error || 'Öğrenci bilgileri alınamadı.';
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.error = 'Bağlantı hatası: ' + (error.message || 'Bilinmeyen bir hata oluştu.');
      }
    });
  }

  onFileChange(event: any): void {
    const files = event.target.files;
    if (files && files.length > 0) {
      this.selectedFile = files[0];

      // Avatar önizleme güncelleme
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target && e.target.result) {
          this.student.avatar = e.target.result;
        }
      };
      // Null kontrolü ekle
      if (this.selectedFile) {
        reader.readAsDataURL(this.selectedFile);
      }
    }
  }

  onSubmit(): void {
    if (this.editForm.invalid) {
      // Form geçersizse tüm kontrolleri dokunulmuş olarak işaretle
      Object.keys(this.editForm.controls).forEach(key => {
        const control = this.editForm.get(key);
        control?.markAsTouched();
      });
      return;
    }

    this.isSubmitting = true;
    this.error = null;
    this.success = null;

    // LocalStorage veya sessionStorage'dan token'ı al
    let token = '';
    const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      token = user.token || '';
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    // Önce avatar yükle (eğer varsa)
    this.uploadAvatar().then(avatarUrl => {
      // Form verilerini hazırla
      const formData = this.prepareFormData(avatarUrl);

      // API'ye gönder
      this.http.post<any>('./server/api/update_profile.php', formData, { headers }).subscribe({
        next: (response) => {
          this.isSubmitting = false;

          if (response.success) {
            this.success = 'Öğrenci bilgileri başarıyla güncellendi.';
            // Güncel verileri tekrar yükle
            setTimeout(() => {
              this.loadStudentData();
            }, 1500);
          } else {
            this.error = response.error || 'Güncelleme sırasında bir hata oluştu.';
          }
        },
        error: (error) => {
          this.isSubmitting = false;
          this.error = 'Bağlantı hatası: ' + (error.message || 'Bilinmeyen bir hata oluştu.');
        }
      });
    }).catch(error => {
      this.isSubmitting = false;
      this.error = 'Avatar yükleme hatası: ' + error;
    });
  }

  uploadAvatar(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.selectedFile) {
        resolve(this.student.avatar || '');
        return;
      }

      // LocalStorage veya sessionStorage'dan token'ı al
      let token = '';
      const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        token = user.token || '';
      }

      const formData = new FormData();
      formData.append('file', this.selectedFile);

      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });

      this.http.post<any>('./server/api/upload.php', formData, { headers }).subscribe({
        next: (response) => {
          if (response.success && response.data && response.data.file_url) {
            resolve(response.data.file_url);
          } else {
            reject(response.error || 'Dosya yüklenemedi.');
          }
        },
        error: (error) => {
          console.error('Avatar yükleme hatası:', error);
          reject(error.message || 'Bağlantı hatası.');
        }
      });
    });
  }

  prepareFormData(avatarUrl: string): any {
    const formValues = this.editForm.value;

    const data: any = {
      id: this.studentId,
      temel_bilgiler: {
        adi_soyadi: formValues.adi_soyadi,
        email: formValues.email,
        cep_telefonu: formValues.cep_telefonu,
        aktif: formValues.aktif
      },
      ogrenci_bilgileri: {
        okulu: formValues.okulu,
        sinifi: formValues.sinifi,
        grubu: formValues.grubu,
        ders_gunu: formValues.ders_gunu,
        ders_saati: formValues.ders_saati,
        ucret: formValues.ucret,
        veli_adi: formValues.veli_adi,
        veli_cep: formValues.veli_cep
      }
    };

    // Avatar ekle (eğer güncellendiyse)
    if (avatarUrl) {
      data.temel_bilgiler.avatar = avatarUrl;
    }

    // Şifre ekle (eğer değiştirildiyse)
    if (formValues.sifre) {
      data.temel_bilgiler.sifre = formValues.sifre;
    }

    return data;
  }

  navigateBack(): void {
    this.router.navigate(['/admin/students']);
  }
}