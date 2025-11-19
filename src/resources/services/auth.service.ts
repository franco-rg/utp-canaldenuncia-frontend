import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, delay, map } from 'rxjs/operators';
import config from 'src/resources/endpoints';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl: string = `${config.URL}/Login`;

  private usuarios = [
    { email: 'admin@example.com', password: 'admin123' },
    { email: 'user@example.com', password: 'user123' }
  ];

  constructor(private http: HttpClient) { }

  login(formData: FormData): Observable<any> {
    const headers = new HttpHeaders({
      'XSRF-TOKEN': config.TOKEN
    });


    return this.http.post(`${this.apiUrl}`, formData, { headers })
      .pipe(
        map((response: any) => {
          if (response.succeeded > 0) {
            localStorage.setItem('token', response.accessToken);
            return { success: true, token: response.accessToken };
          } else {
            return { success: false, error: response.errorMessage };
          }
        }),
        catchError((error) => {
          console.error('Error:', error);
          return of({ success: false, error: error?.error?.message || 'Error de conexión' });
        })
      );

    // if (usuario) {
    //   localStorage.setItem('token', 'jwt-token');
    //   return of({ success: true }).pipe(delay(1000));
    // } else {
    //   return throwError('Correo o contraseña incorrectos').pipe(delay(1000));
    // }
  }

  logout() {
    localStorage.removeItem('token');
  }

  isAuthenticated(): Observable<boolean> {
    if (!localStorage.getItem('token')) {
      return of(false);
    }

    return this.http.get(`${this.apiUrl}?accessToken=${localStorage.getItem('token')}`, { observe: 'response' })
      .pipe(
        map((response: any) => {
          if (response.status === 200) {
            return true;
          } else {
            return false;
          }
        }),
        catchError(() => of(false))
      );
  }
}