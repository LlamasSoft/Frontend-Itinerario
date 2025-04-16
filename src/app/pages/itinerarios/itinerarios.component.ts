import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { TimelineModule } from 'primeng/timeline';

interface Actividad {
  hora: string;
  titulo: string;
  descripcion: string;
  lugar: string;
  costo?: number;
  duracion: string;
}

interface DiaItinerario {
  numero: number;
  fecha: Date;
  actividades: Actividad[];
  resumen: string;
}

@Component({
  selector: 'app-itinerarios',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    DividerModule,
    TimelineModule
  ],
  templateUrl: './itinerarios.component.html',
  styleUrls: ['./itinerarios.component.css']
})
export class ItinerariosComponent {
  diasSeleccionados: number[] = [];
  itinerarios: DiaItinerario[] = [
    {
      numero: 1,
      fecha: new Date(2024, 3, 1),
      resumen: 'Exploración del centro histórico y principales atracciones',
      actividades: [
        {
          hora: '09:00',
          titulo: 'Desayuno en el Mercado Central',
          descripcion: 'Degustación de platos típicos locales',
          lugar: 'Mercado Central de Lima',
          costo: 25,
          duracion: '1 hora'
        },
        {
          hora: '10:30',
          titulo: 'Visita a la Plaza de Armas',
          descripcion: 'Recorrido por la plaza principal y catedral',
          lugar: 'Plaza de Armas de Lima',
          duracion: '2 horas'
        },
        {
          hora: '13:00',
          titulo: 'Almuerzo en restaurante tradicional',
          descripcion: 'Comida peruana gourmet',
          lugar: 'Restaurante Central',
          costo: 80,
          duracion: '1.5 horas'
        }
      ]
    },
    {
      numero: 2,
      fecha: new Date(2024, 3, 2),
      resumen: 'Tour por los museos y arte local',
      actividades: [
        {
          hora: '10:00',
          titulo: 'Visita al Museo Larco',
          descripcion: 'Exploración de arte precolombino',
          lugar: 'Museo Larco',
          costo: 35,
          duracion: '3 horas'
        },
        {
          hora: '14:00',
          titulo: 'Almuerzo en Barranco',
          descripcion: 'Comida en distrito bohemio',
          lugar: 'Restaurante Isolina',
          costo: 45,
          duracion: '1.5 horas'
        }
      ]
    }
  ];

  toggleDia(dia: number) {
    const index = this.diasSeleccionados.indexOf(dia);
    if (index === -1) {
      this.diasSeleccionados.push(dia);
    } else {
      this.diasSeleccionados.splice(index, 1);
    }
  }

  estaSeleccionado(dia: number): boolean {
    return this.diasSeleccionados.includes(dia);
  }

  getDiaSemana(fecha: Date): string {
    const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    return dias[fecha.getDay()];
  }

  getFormatoFecha(fecha: Date): string {
    return fecha.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }
}
