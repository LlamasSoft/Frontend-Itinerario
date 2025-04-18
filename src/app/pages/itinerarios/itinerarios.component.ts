
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { TimelineModule } from 'primeng/timeline';
import { jsPDF } from 'jspdf';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { Component, OnInit } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';

interface Actividad {
  hora: string;
  titulo: string;
  descripcion: string;
  lugar: string;
  costo?: number;
  duracion: string;
  imagen?: string;
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
    TimelineModule,
    DialogModule,
    FormsModule,
    InputTextModule
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
    ])
  ]
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
          duracion: '1 hora',
          imagen: 'https://gestion.pe/resizer/x1CzJGfV0X3tE9Nd-vh-kVBCwQw=/1200x900/smart/filters:format(jpeg):quality(75)/arc-anglerfish-arc2-prod-elcomercio.s3.amazonaws.com/public/X7I24AAJZRHVTHRDFZHBIMU4WQ.jpg'

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

  exportarPDF(dia: DiaItinerario) {
    const doc = new jsPDF();
    const margen = 20;
    let y = margen;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text(`Itinerario - Día ${dia.numero}`, margen, y);
    y += 10;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.text(`Fecha: ${this.getFormatoFecha(dia.fecha)}`, margen, y);
    y += 8;

    doc.text(`Resumen: ${dia.resumen}`, margen, y);
    y += 10;

    doc.setFont('helvetica', 'bold');
    doc.text('Actividades:', margen, y);
    y += 8;

    doc.setFont('helvetica', 'normal');
    dia.actividades.forEach((actividad, index) => {
      doc.text(`${index + 1}. ${actividad.hora} - ${actividad.titulo}`, margen, y);
      y += 6;
      doc.text(`Lugar: ${actividad.lugar}`, margen + 5, y);
      y += 6;
      doc.text(`Duración: ${actividad.duracion}`, margen + 5, y);
      if (actividad.costo) {
        doc.text(`Costo: S/ ${actividad.costo}`, margen + 5, y += 6);
      }
      y += 6;

      if (y > 270) {
        doc.addPage();
        y = margen;
      }
    });

    doc.save(`itinerario-dia-${dia.numero}.pdf`);
  }

  nuevaActividad: Actividad = {
    hora: '',
    titulo: '',
    descripcion: '',
    lugar: '',
    duracion: ''
  };
  mostrarModal: boolean = false;
  indiceDiaSeleccionado: number = -1;

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
      this.itinerarios = [...this.itinerarios];
      this.mostrarModal = false;
    }
  }

  
}
