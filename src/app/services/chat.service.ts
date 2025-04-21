import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl = 'http://localhost:8000/api/deepseek/';

  constructor(private http: HttpClient) { }

  enviarMensaje(mensaje: string): Observable<any> {
    return this.http.post(this.apiUrl, { prompt: mensaje });
  }
}
