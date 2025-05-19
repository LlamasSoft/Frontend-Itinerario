import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { TimelineModule } from 'primeng/timeline';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ItinerarioService, Itinerario, Actividad, Lugar } from '../../services/itinerario.service';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-itinerarios',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    DividerModule,
    TimelineModule,
    DialogModule,
    FormsModule,
    InputTextModule,
    HttpClientModule,
    FooterComponent
  ],
  templateUrl: './itinerarios.component.html',
  styleUrls: ['./itinerarios.component.css']
})
export class ItinerariosComponent implements OnInit {
  itinerarios: Itinerario[] = [];
  loading: boolean = true;
  error: string = '';

  constructor(private itinerarioService: ItinerarioService) { }

  ngOnInit() {
    this.cargarItinerarios();
  }

  cargarItinerarios() {
    this.loading = true;
    this.itinerarioService.obtenerItinerarios().subscribe({
      next: (response) => {
        // Agregar horas estáticas a las actividades
        this.itinerarios = response.data.map(itinerario => ({
          ...itinerario,
          actividades: itinerario.actividades.map(actividad => ({
            ...actividad,
            hora: this.getHoraEstatica(actividad.turno, actividad.orden)
          }))
        }));
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar los itinerarios: ' + err.message;
        this.loading = false;
      }
    });
  }

  getHoraEstatica(turno: string, orden: number): string {
    switch (turno) {
      case 'M':
        // Mañana: 8:00 - 12:00
        return `${8 + orden}:00`;
      case 'T':
        // Tarde: 13:00 - 17:00
        return `${13 + orden}:00`;
      case 'N':
        // Noche: 18:00 - 22:00
        return `${18 + orden}:00`;
      default:
        return '00:00';
    }
  }

  getEstadoClass(estado: string): string {
    switch (estado.toLowerCase()) {
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800';
      case 'completado':
        return 'bg-green-100 text-green-800';
      case 'cancelado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getTurnoLabel(turno: string): string {
    switch (turno) {
      case 'M':
        return 'Mañana';
      case 'T':
        return 'Tarde';
      case 'N':
        return 'Noche';
      default:
        return turno;
    }
  }
}
