import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { TimelineModule } from 'primeng/timeline';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { jsPDF } from 'jspdf';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { trigger, transition, style, animate, keyframes } from '@angular/animations';

interface Actividad {
  hora: string;
  titulo: string;
  descripcion: string;
  lugar: string;
  costo?: number;
  duracion: string;
  transporte?: string;
  imagen?: string;
}

interface DiaItinerario {
  numero: number;
  fecha: Date;
  resumen: string;
  actividades: Actividad[];
}

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
    HttpClientModule
  ],
  templateUrl: './itinerarios.component.html',
  styleUrls: ['./itinerarios.component.css'],
  animations: [
    trigger('expandCollapse', [
      transition(':enter', [
        style({ height: '0', opacity: 0, overflow: 'hidden' }),
        animate('300ms ease-out', style({ height: '*', opacity: 1 }))
      ]),
      transition(':leave', [
        style({ height: '*', opacity: 1, overflow: 'hidden' }),
        animate('250ms ease-in', style({ height: '0', opacity: 0 }))
      ])
    ]),
    trigger('timelineItem', [
      transition(':enter', [
        animate('0.5s ease-out', keyframes([
          style({ opacity: 0, transform: 'translateY(20px)', offset: 0 }),
          style({ opacity: 1, transform: 'translateY(0)', offset: 1 })
        ]))
      ])
    ])
  ]
})
export class ItinerariosComponent implements OnInit {
  itinerarios: DiaItinerario[] = [];
  diasSeleccionados: number[] = [];
  mostrarModal = false;
  mostrarImagenModal = false;
  imagenModalUrl = '';
  indiceDiaSeleccionado = -1;
  nuevaActividad: Actividad = {
    hora: '',
    titulo: '',
    descripcion: '',
    lugar: '',
    duracion: ''
  };

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.http.get<any>('http://127.0.0.1:8000/api/itinerarios/')
      .subscribe({
        next: (response) => {
          if (response.status === 'success') {
            this.itinerarios = response.data.map((dia: any) => ({
              ...dia,
              fecha: new Date(dia.fecha)
            }));
          }
        },
        error: (error) => {
          console.error('Error al cargar itinerarios:', error);
        }
      });
  }

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

  generarTags(dia: DiaItinerario): string[] {
    const tags = [];
    const costoTotal = dia.actividades.reduce((sum, act) => sum + (act.costo || 0), 0);

    if (costoTotal > 100) {
      tags.push('Premium');
    } else if (costoTotal > 50) {
      tags.push('Estándar');
    } else {
      tags.push('Económico');
    }

    const actividadesExteriores = dia.actividades.filter(a =>
      a.lugar.toLowerCase().includes('plaza') ||
      a.lugar.toLowerCase().includes('parque') ||
      a.descripcion.toLowerCase().includes('recorrido')
    ).length;

    if (actividadesExteriores > 0) {
      tags.push('Aire libre');
    }

    if (dia.actividades.some(a => a.costo && a.costo > 30)) {
      tags.push('Gastronomía');
    }

    if (dia.actividades.length > 3) {
      tags.push('Intenso');
    } else {
      tags.push('Relajado');
    }

    return tags;
  }

  abrirModalAgregar(diaIndex: number) {
    this.indiceDiaSeleccionado = diaIndex;
    this.nuevaActividad = {
      hora: '',
      titulo: '',
      descripcion: '',
      lugar: '',
      duracion: ''
    };
    this.mostrarModal = true;
  }

  agregarActividad() {
    if (this.indiceDiaSeleccionado !== -1) {
      const dia = this.itinerarios[this.indiceDiaSeleccionado];
      dia.actividades = [...dia.actividades, { ...this.nuevaActividad }];
      // Ordenar actividades por hora
      dia.actividades.sort((a, b) => a.hora.localeCompare(b.hora));
      this.itinerarios = [...this.itinerarios];
      this.mostrarModal = false;
    }
  }

  exportarPDF(dia: DiaItinerario) {
    const doc = new jsPDF();
    const margen = 20;
    let y = margen;

    // Logo o título
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(0, 105, 92);
    doc.text('✈️ Mi Itinerario de Viaje', margen, y);
    y += 15;

    // Información del día
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text(`Día ${dia.numero}: ${this.getDiaSemana(dia.fecha)} - ${this.getFormatoFecha(dia.fecha)}`, margen, y);
    y += 10;

    doc.setFontSize(12);
    doc.text(`Resumen: ${dia.resumen}`, margen, y);
    y += 15;

    // Actividades
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('Actividades programadas:', margen, y);
    y += 10;

    doc.setFont('helvetica', 'normal');
    dia.actividades.forEach((actividad, index) => {
      // Nuevo día si no cabe
      if (y > 270) {
        doc.addPage();
        y = margen;
      }

      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 105, 92);
      doc.text(`${index + 1}. ${actividad.hora} - ${actividad.titulo}`, margen, y);
      y += 7;

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
      doc.text(`Lugar: ${actividad.lugar}`, margen + 5, y);
      y += 7;

      doc.text(`Duración: ${actividad.duracion}`, margen + 5, y);
      y += 7;

      if (actividad.transporte) {
        doc.text(`Transporte: ${actividad.transporte}`, margen + 5, y);
        y += 7;
      }

      if (actividad.costo) {
        doc.text(`Costo: S/ ${actividad.costo}`, margen + 5, y);
        y += 7;
      }

      if (actividad.descripcion) {
        const splitDesc = doc.splitTextToSize(actividad.descripcion, 170);
        doc.text(splitDesc, margen + 5, y);
        y += splitDesc.length * 7;
      }

      y += 10; // Espacio entre actividades
    });

    // Pie de página
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text('Generado con MiPlanificadorDeViajes - ' + new Date().toLocaleDateString(), margen, 285);

    doc.save(`itinerario-dia-${dia.numero}.pdf`);
  }

  openImageModal(url: string) {
    this.imagenModalUrl = url;
    this.mostrarImagenModal = true;
  }

  compartirItinerario(dia: DiaItinerario) {
    if (navigator.share) {
      navigator.share({
        title: `Itinerario Día ${dia.numero} - ${this.getFormatoFecha(dia.fecha)}`,
        text: `Mira mi itinerario para el ${this.getDiaSemana(dia.fecha)}: ${dia.resumen}`,
        url: window.location.href
      }).catch(err => {
        console.log('Error al compartir:', err);
        this.copiarEnlace();
      });
    } else {
      this.copiarEnlace();
    }
  }

  generarResumenInteligente(dia: DiaItinerario): string {
    const primeraActividad = dia.actividades[0];
    const ultimaActividad = dia.actividades[dia.actividades.length - 1];

    let recomendaciones = [];

    const horaInicio = parseInt(primeraActividad.hora.split(':')[0]);
    if (horaInicio < 9) {
      recomendaciones.push('Desayuna temprano antes de salir');
    } else {
      recomendaciones.push('Puedes tomarte la mañana con calma');
    }

    const actividadesExteriores = dia.actividades.filter(a =>
      a.descripcion.toLowerCase().includes('recorrido') ||
      a.lugar.toLowerCase().includes('plaza') ||
      a.lugar.toLowerCase().includes('parque')
    );

    if (actividadesExteriores.length > 0) {
      recomendaciones.push('Lleva ropa ligera y bloqueador solar');
    }

    const totalCosto = dia.actividades.reduce((sum, act) => sum + (act.costo || 0), 0);
    if (totalCosto > 100) {
      recomendaciones.push('Recuerda llevar suficiente efectivo o tu tarjeta');
    }

    recomendaciones.push(`Tu primera actividad empieza a las ${primeraActividad.hora}`);

    return recomendaciones.join('. ') + '.';
  }

  private copiarEnlace() {
    // Implementar lógica para copiar enlace al portapapeles
    console.log('Copiar enlace implementado aquí');
    // Mostrar notificación de copiado
  }


}