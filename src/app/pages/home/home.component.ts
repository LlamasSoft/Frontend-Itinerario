import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormsModule } from '@angular/forms';
import { DividerModule } from 'primeng/divider';
import { AnimateOnScrollModule } from 'primeng/animateonscroll';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    InputTextModule,
    ButtonModule,
    CalendarModule,
    InputNumberModule,
    DividerModule,
    AnimateOnScrollModule,
    DropdownModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  title = 'Bienvenido a Itinerario App AI';
  mensaje: string = '';
  presupuesto: number = 0;
  diasViaje: number = 1;
  fechaSalida: Date = new Date();
  fechaMinima: Date = new Date();
  mensajes: { texto: string; esUsuario: boolean }[] = [];

  // Estados de la guía
  pasoActual: number = 1;
  pasosCompletados: boolean[] = [false, false, false];
  mostrarChat: boolean = false;

  // Opciones de moneda
  monedas = [
    { label: 'Soles (S/)', value: 'PEN' },
    { label: 'Dólares ($)', value: 'USD' },
    { label: 'Euros (€)', value: 'EUR' }
  ];
  monedaSeleccionada = this.monedas[0];

  // Mensajes de guía
  mensajesGuia = [
    "¿Cuál es tu presupuesto para el viaje?",
    "¿Cuántos días planeas viajar?",
    "¿Cuándo te gustaría comenzar tu viaje?"
  ];

  constructor() {
    // Establecer la hora a 00:00:00 para la fecha mínima
    this.fechaMinima.setHours(0, 0, 0, 0);
  }

  siguientePaso() {
    if (this.pasoActual < 3) {
      this.pasosCompletados[this.pasoActual - 1] = true;
      this.pasoActual++;
    } else {
      this.mostrarChat = true;
      const moneda = this.monedaSeleccionada.label.split(' ')[0];
      const diasTexto = this.diasViaje === 1 ? 'día' : 'días';
      this.mensajes.push({
        texto: `¡Perfecto! Con tu presupuesto de ${this.presupuesto} ${moneda}, ${this.diasViaje} ${diasTexto} de viaje y fecha de salida ${this.fechaSalida.toLocaleDateString()}, podemos crear un itinerario personalizado. ¿Qué lugares te gustaría visitar o qué actividades te interesan?`,
        esUsuario: false
      });
    }
  }

  enviarMensaje() {
    if (this.mensaje.trim()) {
      this.mensajes.push({ texto: this.mensaje, esUsuario: true });
      this.mensaje = '';
    }
  }

  esPasoCompletado(paso: number): boolean {
    return this.pasosCompletados[paso - 1];
  }

  getPresupuestoMinimo(): number {
    return this.monedaSeleccionada.value === 'PEN' ? 100 : 30;
  }

  esFechaValida(): boolean {
    return this.fechaSalida >= this.fechaMinima;
  }

  getDiasTexto(): string {
    return this.diasViaje === 1 ? 'día' : 'días';
  }
}
