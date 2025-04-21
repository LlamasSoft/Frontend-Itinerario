import { Component, OnInit } from '@angular/core';
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
import { CiudadService, Ciudad, GrupoCiudades } from '../../services/ciudad.service';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { FilterService } from 'primeng/api';

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
    DropdownModule,
    AutoCompleteModule,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  title = 'Bienvenido a Itinerario App AI';
  mensaje: string = '';
  presupuesto: number = 0;
  diasViaje: number = 1;
  fechaSalida: Date = new Date();
  fechaMinima: Date = new Date();
  lugarSalida: string = '';
  destinosDeseados: string = '';
  mensajes: { texto: string; esUsuario: boolean }[] = [];

  // Estados de la guía
  pasoActual: number = 1;
  pasosCompletados: boolean[] = [false, false, false, false, false];
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
    "¿Cuándo te gustaría comenzar tu viaje?",
    "¿Desde dónde partirás tu viaje?",
    "¿Qué destinos te gustaría visitar?"
  ];

  estaEscribiendo: boolean = false;

  selectedCity: any = null;
  filteredGroups: GrupoCiudades[] = [];
  groupedCities: GrupoCiudades[] = [];

  selectedDestinos: any[] = [];
  filteredDestinos: GrupoCiudades[] = [];
  groupedDestinos: GrupoCiudades[] = [];

  constructor(
    private chatService: ChatService, 
    private ciudadService: CiudadService,
    private filterService: FilterService
  ) {
    // Establecer la hora a 00:00:00 para la fecha mínima
    this.fechaMinima.setHours(0, 0, 0, 0);
  }

  ngOnInit() {
    this.cargarCiudadesPeru();
  }

  cargarCiudadesPeru() {
    console.log('Iniciando carga de ciudades...');
    this.ciudadService.getCiudadesPorPais('Peru').subscribe(
      (ciudades) => {
        console.log('Ciudades recibidas de la API:', ciudades);
        
        if (!Array.isArray(ciudades) || ciudades.length === 0) {
          console.error('No se recibieron ciudades válidas');
          return;
        }

        // Crear un solo grupo para todas las ciudades
        this.groupedCities = [{
          label: 'Perú',
          value: 'pe',
          items: ciudades.map(ciudad => ({
            label: ciudad.name,
            value: ciudad.name
          }))
        }];

        // Preparar los destinos con el mismo formato
        this.groupedDestinos = [{
          label: 'Perú',
          value: 'pe',
          items: ciudades.map(ciudad => ({
            label: ciudad.name,
            value: ciudad.name
          }))
        }];

        console.log('Grupos de ciudades finales:', this.groupedCities);
      },
      (error) => {
        console.error('Error al cargar ciudades:', error);
      }
    );
  }

  filterGroupedCity(event: AutoCompleteCompleteEvent) {
    let query = event.query;
    console.log('Query de búsqueda:', query);
    console.log('Grupos de ciudades disponibles:', this.groupedCities);
    
    let filteredGroups: GrupoCiudades[] = [];

    for (let optgroup of this.groupedCities) {
      let filteredSubOptions = this.filterService.filter(optgroup.items, ['label'], query, "contains");
      console.log('Opciones filtradas para grupo', optgroup.label, ':', filteredSubOptions);
      
      if (filteredSubOptions && filteredSubOptions.length) {
        filteredGroups.push({
          label: optgroup.label,
          value: optgroup.value,
          items: filteredSubOptions
        });
      }
    }

    console.log('Grupos filtrados finales:', filteredGroups);
    this.filteredGroups = filteredGroups;
  }

  siguientePaso() {
    if (this.pasoActual < 5) {
      this.pasosCompletados[this.pasoActual - 1] = true;
      this.pasoActual++;
    } else {
      this.mostrarChat = true;
      const moneda = this.monedaSeleccionada.label.split(' ')[0];
      const diasTexto = this.diasViaje === 1 ? 'día' : 'días';
      const lugarSalidaTexto = this.selectedCity ? `, saliendo desde ${this.selectedCity}` : '';
      const destinosTexto = this.selectedDestinos.length > 0 
        ? ` y con interés en visitar ${this.selectedDestinos.length > 1 
            ? this.selectedDestinos.slice(0, -1).join(', ') + ' y ' + this.selectedDestinos[this.selectedDestinos.length - 1]
            : this.selectedDestinos[0]}`
        : '';
      const mensajeInicial = `¡Perfecto! Con tu presupuesto de ${this.presupuesto} ${moneda}, ${this.diasViaje} ${diasTexto} de viaje${lugarSalidaTexto}${destinosTexto} podemos crear un itinerario personalizado. ¿Qué tipo de experiencias te gustaría vivir durante tu viaje? ¿Prefieres actividades culturales, aventura, gastronomía o una mezcla de todo?`;
      
      this.mensajes.push({
        texto: mensajeInicial,
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
- Lugar de salida: ${this.lugarSalida}
${this.destinosDeseados ? `- Destinos deseados: ${this.destinosDeseados}` : ''}

Mensaje del usuario: "${mensajeUsuario}"

Por favor, proporciona recomendaciones de viaje considerando el presupuesto, la duración, la fecha de salida y el lugar de origen.
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

  searchDestinos(event: AutoCompleteCompleteEvent) {
    let query = event.query;
    console.log('Query de búsqueda:', query);
    
    if (!query) {
      this.filteredDestinos = [];
      return;
    }

    let filteredGroups: GrupoCiudades[] = [];

    for (let optgroup of this.groupedDestinos) {
      let filteredSubOptions = this.filterService.filter(optgroup.items, ['label'], query, "contains");
      if (filteredSubOptions && filteredSubOptions.length) {
        filteredGroups.push({
          label: optgroup.label,
          value: optgroup.value,
          items: filteredSubOptions
        });
      }
    }

    this.filteredDestinos = filteredGroups;
  }

  onSelectDestino(event: any) {
    console.log('Destino seleccionado:', event.value);
    console.log('Destinos seleccionados:', this.selectedDestinos);
  }

  onUnselectDestino(event: any) {
    console.log('Destino deseleccionado:', event.value);
    this.selectedDestinos = this.selectedDestinos.filter(destino => destino !== event.query);
  }
}
