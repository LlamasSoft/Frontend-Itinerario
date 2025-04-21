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
import { ChatService } from '../../services/chat.service';

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

  estaEscribiendo: boolean = false;

  constructor(private chatService: ChatService) {
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

  limpiarTextoLaTeX(texto: string): string {
    // Primero limpiar LaTeX
    let textoLimpio = texto
      .replace(/\\\[/g, '')  // Eliminar \[
      .replace(/\\\]/g, '')  // Eliminar \]
      .replace(/\\boxed{/g, '')  // Eliminar \boxed{
      .replace(/}/g, '')  // Eliminar }
      .replace(/\\\(/g, '')  // Eliminar \(
      .replace(/\\\)/g, '')  // Eliminar \)
      .replace(/\*\*/g, '')  // Eliminar **
      .replace(/\*/g, '')  // Eliminar *
      .replace(/\n/g, '<br>');  // Convertir saltos de línea en HTML

    // Convertir Markdown a HTML
    textoLimpio = textoLimpio
      .replace(/### (.*?)<br>/g, '<h3>$1</h3>')  // Convertir ### en h3
      .replace(/# (.*?)<br>/g, '<h2>$1</h2>')  // Convertir # en h2
      .replace(/- (.*?)<br>/g, '<li>$1</li>')  // Convertir - en li
      .replace(/<br><li>/g, '<ul><li>')  // Agregar ul antes del primer li
      .replace(/<\/li><br>/g, '</li></ul><br>');  // Cerrar ul después del último li

    return textoLimpio;
  }

  generarPrompt(mensajeUsuario: string): string {
    const moneda = this.monedaSeleccionada.label.split(' ')[0];
    const diasTexto = this.diasViaje === 1 ? 'día' : 'días';

    return `Contexto del viaje:
- Presupuesto: ${this.presupuesto} ${moneda}
- Duración: ${this.diasViaje} ${diasTexto}
- Fecha de salida: ${this.fechaSalida.toLocaleDateString()}

Mensaje del usuario: "${mensajeUsuario}"

Por favor, proporciona recomendaciones de viaje considerando el presupuesto, la duración y la fecha de salida.
Sé específico con los lugares, actividades y costos aproximados.
Si el usuario no especifica un destino, sugiere opciones dentro del presupuesto y tiempo disponibles.`;
  }

  enviarMensaje() {
    if (this.mensaje.trim()) {
      // Agregar mensaje del usuario
      this.mensajes.push({ texto: this.mensaje, esUsuario: true });

      // Mostrar animación de escribiendo
      this.estaEscribiendo = true;

      // Generar prompt estructurado
      const promptEstructurado = this.generarPrompt(this.mensaje);

      // Enviar mensaje a la API
      this.chatService.enviarMensaje(promptEstructurado).subscribe({
        next: (respuesta) => {
          // Ocultar animación de escribiendo
          this.estaEscribiendo = false;

          // Limpiar el texto de formato LaTeX y Markdown
          const textoLimpio = this.limpiarTextoLaTeX(respuesta.data);

          // Agregar respuesta del asistente
          this.mensajes.push({
            texto: textoLimpio || 'Lo siento, no pude procesar tu mensaje.',
            esUsuario: false
          });
        },
        error: (error) => {
          // Ocultar animación de escribiendo
          this.estaEscribiendo = false;

          console.error('Error al enviar mensaje:', error);
          this.mensajes.push({
            texto: 'Lo siento, hubo un error al procesar tu mensaje. Por favor, intenta nuevamente.',
            esUsuario: false
          });
        }
      });

      // Limpiar el input
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
