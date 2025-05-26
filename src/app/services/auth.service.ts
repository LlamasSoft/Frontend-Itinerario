import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

export interface Usuario {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  token?: string;
}

export interface LoginResponse {
  status: string;
  message: string;
  data: {
    user_id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/api/auth/';
  private usuarioActual = new BehaviorSubject<Usuario | null>(null);

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    // Recuperar usuario del localStorage al iniciar
    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
      this.usuarioActual.next(JSON.parse(usuarioGuardado));
    }
  }

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}login/`, { username, password })
      .pipe(
        tap(response => {
          if (response.status === 'success') {
            const usuario: Usuario = {
              id: response.data.user_id,
              username: response.data.username,
              email: response.data.email,
              first_name: response.data.first_name,
              last_name: response.data.last_name
            };
            this.guardarUsuario(usuario);
          }
        })
      );
  }

  registro(username: string, email: string, password: string, first_name: string, last_name: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}registro/`, {
      username,
      email,
      password,
      first_name,
      last_name
    }).pipe(
      tap(response => {
        if (response.status === 'success') {
          const usuario: Usuario = {
            id: response.data.user_id,
            username: response.data.username,
            email: response.data.email,
            first_name: response.data.first_name,
            last_name: response.data.last_name
          };
          this.guardarUsuario(usuario);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('usuario');
    this.usuarioActual.next(null);
    this.router.navigate(['/login']);
  }

  private guardarUsuario(usuario: Usuario): void {
    localStorage.setItem('usuario', JSON.stringify(usuario));
    this.usuarioActual.next(usuario);
  }

  getUsuarioActual(): Observable<Usuario | null> {
    return this.usuarioActual.asObservable();
  }

  estaAutenticado(): boolean {
    return !!this.usuarioActual.value;
  }

  getToken(): string | null {
    return this.usuarioActual.value?.token || null;
  }
}
