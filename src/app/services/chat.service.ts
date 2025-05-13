import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl = 'http://localhost:8000/api/deepseek/';
  private imagesUrl = 'http://127.0.0.1:8000/api/images/';
  private climaUrl = 'http://localhost:8000/api/clima/';

  constructor(private http: HttpClient) { }

  enviarMensaje(mensaje: string): Observable<any> {
    return this.http.post(this.apiUrl, { prompt: mensaje });
  }

  obtenerImagenesLugar(nombreLugar: string): Observable<any> {
    return this.http.post(this.imagesUrl, { nombre_lugar: nombreLugar });
  }

  obtenerClima(ciudad: string, pais: string): Observable<any> {
    return this.http.get(this.climaUrl, {
      params: {
        ciudad: ciudad,
        pais: pais
      }
    });
  }
}
