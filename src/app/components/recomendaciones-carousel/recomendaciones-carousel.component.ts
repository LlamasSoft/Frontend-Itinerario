import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselModule } from 'primeng/carousel';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-recomendaciones-carousel',
  standalone: true,
  imports: [
    CommonModule,
    CarouselModule,
    CardModule,
    ButtonModule
  ],
  templateUrl: './recomendaciones-carousel.component.html',
  styleUrls: ['./recomendaciones-carousel.component.css']
})
export class RecomendacionesCarouselComponent {
  @Input() recomendaciones: any[] = [];
  @Output() recomendacionAgregada = new EventEmitter<any>();

  responsiveOptions = [
    {
      breakpoint: '1024px',
      numVisible: 1,
      numScroll: 1
    },
    {
      breakpoint: '768px',
      numVisible: 1,
      numScroll: 1
    },
    {
      breakpoint: '560px',
      numVisible: 1,
      numScroll: 1
    }
  ];

  calcularTotalTransporte(transporte: any): number {
    const costoIda = this.extraerNumero(transporte.costoIda);
    const costoVuelta = this.extraerNumero(transporte.costoVuelta);
    return costoIda + costoVuelta;
  }

  calcularTotalActividades(actividades: any[]): number {
    return actividades.reduce((total, actividad) => {
      return total + this.extraerNumero(actividad.costo);
    }, 0);
  }

  calcularTotalComidas(lugaresComida: any[]): number {
    return lugaresComida.reduce((total, lugar) => {
      return total + this.extraerNumero(lugar.costoAproximado);
    }, 0);
  }

  calcularTotalRecomendacion(recomendacion: any): number {
    const totalTransporte = this.calcularTotalTransporte(recomendacion.costoTransporte);
    const totalActividades = this.calcularTotalActividades(recomendacion.actividades);
    const totalComidas = this.calcularTotalComidas(recomendacion.lugaresComida);
    return totalTransporte + totalActividades + totalComidas;
  }

  formatearCosto(costo: number): string {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(costo);
  }

  private extraerNumero(texto: string): number {
    const match = texto.match(/\d+(\.\d+)?/);
    return match ? parseFloat(match[0]) : 0;
  }

  agregarRecomendacion(recomendacion: any): void {
    this.recomendacionAgregada.emit(recomendacion);
  }
}
