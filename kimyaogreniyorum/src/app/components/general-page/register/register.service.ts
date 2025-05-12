import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  // Geliştirme ortamı için API URL
  private apiUrl = './server/api/register.php';

  constructor(private http: HttpClient) {}

  register(formData: FormData): Observable<any> {
    return this.http.post(this.apiUrl, formData);
  }
}
