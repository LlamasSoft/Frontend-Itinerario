import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { AccordionModule } from 'primeng/accordion';
import { TimelineModule } from 'primeng/timeline';

export interface DetalleCostos {
  transporte: string;
  entradas: string;
  alimentacion: string;
  equipo_lluvia: string;
}

export interface RecomendacionesClima {
  mensaje: string;
}

export interface Transporte {
  tipo_transporte: {
    nombre: string;
  };
  nombre: string;
  costoIda?: string;
  costoVuelta?: string;
}

export interface Itinerario {
  dia: number;
  fecha: string;
  lugar: string;
  ciudad: {
    name: string;
    state: {
      name: string;
    };
    country: {
      name: string;
    };
  };
  costo: string;
  clima: {
    fecha: string;
    ciudad: {
      name: string;
    };
    pais: {
      name: string;
    };
    temperatura_maxima: number;
    temperatura_minima: number;
    estado_clima: string;
    humedad: number;
    probabilidad_lluvia: number;
  };
  transporte: Transporte;
  actividades: Array<{
    turno: string;
    orden: number;
    lugares: Array<{
      nombre: string;
      descripcion: string;
      ubicacion: string;
      tipo_lugar: {
        nombre: string;
      };
    }>;
  }>;
  detalle_costos?: DetalleCostos;
  recomendaciones_clima?: RecomendacionesClima;
}

@Component({
  selector: 'app-itinerario-detallado',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    AccordionModule,
    TimelineModule
  ],
  templateUrl: './itinerario-detallado.component.html',
  styleUrls: ['./itinerario-detallado.component.css']
})
export class ItinerarioDetalladoComponent {
  @Input() itinerarios: Itinerario[] = [];

  formatearCosto(costo: string): string {
    return costo;
  }

  extraerNumero(texto: string): number {
    const match = texto.match(/\d+(\.\d+)?/);
    return match ? parseFloat(match[0]) : 0;
  }

  calcularTotalDia(itinerario: Itinerario): string {
    return itinerario.costo;
  }

  getTurnoClass(turno: string): string {
    switch(turno.toLowerCase()) {
      case 'mañana':
        return 'bg-yellow-50 text-yellow-700';
      case 'tarde':
        return 'bg-orange-50 text-orange-700';
      case 'noche':
        return 'bg-blue-50 text-blue-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  }

  calcularCostoTotal(): string {
    return this.itinerarios[0]?.costo || '0 PEN';
  }
}
