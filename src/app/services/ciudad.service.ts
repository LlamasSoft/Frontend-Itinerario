import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Ciudad {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
}

export interface GrupoCiudades {
  label: string;
  value: string;
  items: { label: string; value: string }[];
}

interface ApiResponse {
  status: string;
  data: Ciudad[];
}

@Injectable({
  providedIn: 'root'
})
export class CiudadService {
  private apiUrl = 'http://localhost:8000/api/ciudades/';

  constructor(private http: HttpClient) { }

  getCiudadesPorPais(pais: string): Observable<Ciudad[]> {
    return this.http.get<ApiResponse>(this.apiUrl, { params: { pais: pais } })
      .pipe(
        map(response => {
          if (response.status === 'success' && Array.isArray(response.data)) {
            return response.data;
          }
          console.error('Respuesta inválida:', response);
          return [];
        })
      );
  }
} 