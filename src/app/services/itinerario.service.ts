import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Ciudad {
  id: number;
  nombre: string;
}

export interface Pais {
  id: number;
  nombre: string;
}

export interface Viaje {
  id: number;
  presupuesto: number;
  dia_salida: string;
  duracion_viaje: number;
  estado: string;
}

export interface Clima {
  id: number;
  fecha: string;
  temperatura_actual: number;
  temperatura_sensacion: number;
  descripcion: string;
  estado_clima: string;
  humedad: number;
  velocidad_viento: number;
  direccion_viento: number;
  probabilidad_lluvia: number;
}

export interface Transporte {
  id: number;
  nombre: string;
  tipo_transporte: string;
}

export interface Lugar {
  id: number;
  nombre: string;
  descripcion: string;
  ubicacion: string;
  tipo_lugar: string;
}

export interface Actividad {
  id: number;
  turno: string;
  orden: number;
  estado: string;
  lugares: Lugar[];
  hora?: string;
}

export interface Itinerario {
  id: number;
  lugar: string;
  ciudad: Ciudad;
  pais: Pais;
  dia: number;
  costo: number;
  estado: string;
  viaje: Viaje;
  clima: Clima;
  transporte: Transporte;
  actividades: Actividad[];
}

export interface ItinerarioResponse {
  status: string;
  message: string;
  data: Itinerario[];
}

@Injectable({
  providedIn: 'root'
})
export class ItinerarioService {
  private apiUrl = 'http://localhost:8000/api/itinerario/';

  constructor(private http: HttpClient) { }

  obtenerItinerarios(): Observable<ItinerarioResponse> {
    return this.http.get<ItinerarioResponse>(this.apiUrl);
  }
}
