import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { AccordionModule } from 'primeng/accordion';
import { TimelineModule } from 'primeng/timeline';

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
  @Input() itinerarios: any[] = [];

  formatearCosto(costo: number): string {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(costo);
  }

  extraerNumero(texto: string): number {
    const match = texto.match(/\d+(\.\d+)?/);
    return match ? parseFloat(match[0]) : 0;
  }

  calcularTotalDia(itinerario: any): number {
    const totalActividades = itinerario.actividades.reduce((total: number, actividad: any) => {
      return total + this.extraerNumero(actividad.costo);
    }, 0);

    const totalTransporte = this.extraerNumero(itinerario.transporte.costoIda) +
                           this.extraerNumero(itinerario.transporte.costoVuelta);

    return totalActividades + totalTransporte;
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

  calcularCostoTotal(): number {
    return this.itinerarios.reduce((total, it) => total + this.calcularTotalDia(it), 0);
  }
}
