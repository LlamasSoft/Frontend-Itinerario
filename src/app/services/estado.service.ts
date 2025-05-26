import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface EstadoResponse {
  status: string;
  message: string;
  data: {
    id: number;
    nombre: string;
    pais: {
      id: number;
      nombre: string;
    };
    ciudad: {
      id: number;
      nombre: string;
    };
  };
}

@Injectable({
  providedIn: 'root'
})
export class EstadoService {
  private apiUrl = 'http://localhost:8000/api/estado-por-ciudad/';

  constructor(private http: HttpClient) { }

  obtenerEstadoPorCiudad(ciudad: string, pais: string): Observable<EstadoResponse> {
    return this.http.get<EstadoResponse>(this.apiUrl, {
      params: {
        ciudad: ciudad,
        pais: pais
      }
    });
  }
}

