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
import { CarouselModule } from 'primeng/carousel';
import { delay, timer } from 'rxjs';

interface Actividad {
  nombre: string;
  descripcion: string;
  costo: string;
  duracion: string;
  incluye: string[];
  noIncluye: string[];
}

interface LugarComida {
  nombre: string;
  tipo: string;
  descripcion: string;
  costoAproximado: string;
  horario: string;
  ubicacion: string;
  especialidad: string;
}

interface CostoTransporte {
  tipoTransporte: string;
  costoIda: string;
  costoVuelta: string;
  duracionViaje: string;
  frecuencia: string;
  puntoPartida: string;
  puntoLlegada: string;
  observaciones: string;
}

interface Recomendacion {
  titulo: string;
  descripcion: string;
  actividades: Actividad[];
  lugaresComida: LugarComida[];
  costoTotal: string;
  costoTransporte: CostoTransporte;
  imagen?: string;
  detallesAdicionales?: {
    mejorEpoca: string;
    recomendaciones: string[];
    tips: string[];
  };
}

interface Itinerario {
  id: string;
  recomendacion: Recomendacion;
  fecha: Date;
  estado: 'pendiente' | 'confirmado' | 'completado';
}

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
    CarouselModule
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
  historialConversacion: { role: string; content: string }[] = [];
  recomendaciones: Recomendacion[] = [];
  itinerarios: Itinerario[] = [];

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

  // Opciones responsivas para el carrusel
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

  preferenciasUsuario: string[] = [];

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

    // Convertir Markdown a HTML y mantener caracteres especiales
    textoLimpio = textoLimpio
      .replace(/### (.*?)<br>/g, '<h3>$1</h3>')  // Convertir ### en h3
      .replace(/# (.*?)<br>/g, '<h2>$1</h2>')  // Convertir # en h2
      .replace(/- (.*?)<br>/g, '<li>$1</li>')  // Convertir - en li
      .replace(/<br><li>/g, '<ul><li>')  // Agregar ul antes del primer li
      .replace(/<\/li><br>/g, '</li></ul><br>')  // Cerrar ul después del último li
      .replace(/<ul><li>/g, '<ul><li>')  // Evitar dobles viñetas
      .replace(/<\/li><\/ul><br><ul><li>/g, '</li><li>')  // Unir listas consecutivas
      .replace(/\\'a/g, 'á')  // Convertir \'a a á
      .replace(/\\'e/g, 'é')  // Convertir \'e a é
      .replace(/\\'i/g, 'í')  // Convertir \'i a í
      .replace(/\\'o/g, 'ó')  // Convertir \'o a ó
      .replace(/\\'u/g, 'ú')  // Convertir \'u a ú
      .replace(/\\~n/g, 'ñ')  // Convertir \~n a ñ
      .replace(/\\'A/g, 'Á')  // Convertir \'A a Á
      .replace(/\\'E/g, 'É')  // Convertir \'E a É
      .replace(/\\'I/g, 'Í')  // Convertir \'I a Í
      .replace(/\\'O/g, 'Ó')  // Convertir \'O a Ó
      .replace(/\\'U/g, 'Ú')  // Convertir \'U a Ú
      .replace(/\\~N/g, 'Ñ');  // Convertir \~N a Ñ

    return textoLimpio;
  }

  procesarPreferencias(mensaje: string): string[] {
    const preferencias: string[] = [];
    const mensajeLower = mensaje.toLowerCase();

    if (mensajeLower.includes('aventura') || mensajeLower.includes('adrenalina') || mensajeLower.includes('extremo')) {
      preferencias.push('aventura');
    }
    if (mensajeLower.includes('cultura') || mensajeLower.includes('historia') || mensajeLower.includes('museo')) {
      preferencias.push('cultura');
    }
    if (mensajeLower.includes('gastronomía') || mensajeLower.includes('comida') || mensajeLower.includes('restaurante')) {
      preferencias.push('gastronomía');
    }
    if (mensajeLower.includes('naturaleza') || mensajeLower.includes('paisaje') || mensajeLower.includes('aire libre')) {
      preferencias.push('naturaleza');
    }
    if (mensajeLower.includes('relax') || mensajeLower.includes('descanso') || mensajeLower.includes('tranquilo')) {
      preferencias.push('relax');
    }

    return preferencias.length > 0 ? preferencias : ['mixto'];
  }

  generarPrompt(mensajeUsuario: string): string {
    const moneda = this.monedaSeleccionada.label.split(' ')[0];
    const diasTexto = this.diasViaje === 1 ? 'día' : 'días';
    const lugarSalidaTexto = this.selectedCity ? `, saliendo desde ${this.selectedCity}` : '';
    const destinosTexto = this.selectedDestinos.length > 0
      ? ` y con interés en visitar ${this.selectedDestinos.length > 1
          ? this.selectedDestinos.slice(0, -1).join(', ') + ' y ' + this.selectedDestinos[this.selectedDestinos.length - 1]
          : this.selectedDestinos[0]}`
      : '';

    // Procesar las preferencias del usuario
    this.preferenciasUsuario = this.procesarPreferencias(mensajeUsuario);

    // Agregar el nuevo mensaje al historial
    this.historialConversacion.push({ role: 'user', content: mensajeUsuario });

    // Construir el contexto de la conversación
    const contextoConversacion = this.historialConversacion
      .slice(-5)
      .map(msg => `${msg.role === 'user' ? 'Usuario' : 'Asistente'}: ${msg.content}`)
      .join('\n');

    const destinosSeleccionados = this.selectedDestinos.length > 0
      ? this.selectedDestinos.length > 1
        ? this.selectedDestinos.slice(0, -1).join(', ') + ' y ' + this.selectedDestinos[this.selectedDestinos.length - 1]
        : this.selectedDestinos[0]
      : 'No especificados';

    return `Contexto del viaje:
- Presupuesto: ${this.presupuesto} ${moneda}
- Duración: ${this.diasViaje} ${diasTexto}
- Fecha de salida: ${this.fechaSalida.toLocaleDateString()}
- Lugar de salida: ${this.selectedCity || 'No especificado'}
- Destinos deseados: ${destinosSeleccionados}
- Preferencias del usuario: ${this.preferenciasUsuario.join(', ')}

Historial de la conversación:
${contextoConversacion}

IMPORTANTE: Asegúrate de que el texto incluya todos los caracteres especiales (tildes, ñ) correctamente. No uses códigos LaTeX para los caracteres especiales, envíalos directamente como caracteres UTF-8.

Por favor, proporciona recomendaciones de viaje en el siguiente formato JSON estricto (asegúrate de que sea un JSON válido):

{
  "mensaje": "Tu respuesta general en formato de texto",
  "recomendaciones": [
    {
      "titulo": "Nombre específico del lugar (ej: 'Plaza de Armas de Cajamarca', 'Baños del Inca', 'Ventanillas de Otuzco')",
      "descripcion": "Descripción detallada de la recomendación",
      "actividades": [
        {
          "nombre": "Nombre de la actividad",
          "descripcion": "Descripción detallada de la actividad",
          "costo": "Costo aproximado (especificar si incluye: guía, equipo, entradas, seguros, etc.)",
          "duracion": "Duración estimada",
          "incluye": [
            "Lista de lo que incluye el costo (ej: guía local, equipo necesario, entradas, seguros, etc.)"
          ],
          "noIncluye": [
            "Lista de lo que no incluye el costo (ej: transporte, comidas, equipo personal, etc.)"
          ]
        }
      ],
      "lugaresComida": [
        {
          "nombre": "Nombre del restaurante o lugar de comida",
          "tipo": "Tipo de comida (ej: comida típica, internacional, etc.)",
          "descripcion": "Descripción del lugar y su ambiente",
          "costoAproximado": "Costo aproximado por persona",
          "horario": "Horario de atención",
          "ubicacion": "Ubicación específica",
          "especialidad": "Plato o especialidad recomendada"
        }
      ],
      "costoTotal": "Costo total estimado (INCLUYENDO transporte desde ${this.selectedCity || 'lugar de origen'} y comidas)",
      "costoTransporte": {
        "tipoTransporte": "Tipo de transporte (ej: taxi, bus, colectivo, etc.)",
        "costoIda": "Costo de ida por persona",
        "costoVuelta": "Costo de vuelta por persona",
        "duracionViaje": "Duración estimada del viaje",
        "frecuencia": "Frecuencia del transporte (ej: cada 30 minutos, cada hora, etc.)",
        "puntoPartida": "Punto de partida específico en ${this.selectedCity || 'lugar de origen'}",
        "puntoLlegada": "Punto de llegada específico en el destino",
        "observaciones": "Observaciones importantes sobre el transporte"
      },
      "detallesAdicionales": {
        "mejorEpoca": "Mejor época para visitar",
        "recomendaciones": ["Recomendación 1", "Recomendación 2"],
        "tips": ["Tip 1", "Tip 2"]
      }
    }
  ]
}

Considera:
1. El contexto del viaje proporcionado, especialmente:
   - El lugar de salida (${this.selectedCity || 'no especificado'})
   - Los destinos deseados (${destinosSeleccionados})
   - El presupuesto disponible (${this.presupuesto} ${moneda})
   - Las preferencias del usuario (${this.preferenciasUsuario.join(', ')})
2. El historial de la conversación para mantener coherencia
3. Sé específico con lugares, actividades y costos aproximados
4. Si se han especificado destinos, prioriza recomendaciones que incluyan esos destinos
5. Si no hay destinos especificados, sugiere opciones cercanas al lugar de salida dentro del presupuesto y tiempo disponibles
6. Mantén un tono amigable y profesional
7. Asegúrate de que el JSON sea válido y esté correctamente formateado
8. IMPORTANTE: Usa nombres específicos de lugares (ej: 'Plaza de Armas de Cajamarca', 'Baños del Inca', 'Ventanillas de Otuzco') en lugar de nombres genéricos
9. IMPORTANTE: Usa caracteres especiales (tildes, ñ) directamente en el texto, no uses códigos LaTeX para ellos
10. IMPORTANTE: Incluye siempre el costo de transporte desde el lugar de origen (${this.selectedCity || 'lugar de origen'}) en el costoTotal y especifica el costoTransporte por separado
11. IMPORTANTE: Asegúrate de que el costoTotal de cada recomendación no exceda el presupuesto disponible (${this.presupuesto} ${moneda}). Si es necesario, sugiere opciones más económicas o formas de reducir costos
12. IMPORTANTE: Especifica con detalle los costos de transporte, incluyendo:
    - Tipo de transporte disponible
    - Costo de ida y vuelta por persona
    - Duración del viaje
    - Frecuencia del servicio
    - Puntos específicos de partida y llegada
    - Cualquier observación importante sobre el transporte
13. IMPORTANTE: Incluye al menos 2-3 opciones de lugares para comer en cada recomendación, con:
    - Nombre específico del restaurante o lugar
    - Tipo de comida que sirven
    - Costo aproximado por persona
    - Horario de atención
    - Ubicación específica
    - Especialidad o plato recomendado
14. IMPORTANTE: Asegúrate de que la suma de:
    - Costo de transporte (ida y vuelta)
    - Costo de actividades
    - Costo de comidas
    Sea igual o menor al costoTotal especificado
15. IMPORTANTE: Si el presupuesto es limitado, sugiere opciones económicas de comida y transporte
16. IMPORTANTE: Prioriza actividades y lugares que coincidan con las preferencias del usuario (${this.preferenciasUsuario.join(', ')}). Por ejemplo:
    - Si el usuario prefiere aventura, incluye actividades como trekking, rafting, escalada, etc.
    - Si el usuario prefiere cultura, incluye museos, sitios históricos, centros culturales, etc.
    - Si el usuario prefiere gastronomía, incluye restaurantes típicos, mercados locales, clases de cocina, etc.
    - Si el usuario prefiere naturaleza, incluye parques naturales, reservas, miradores, etc.
    - Si el usuario prefiere relax, incluye spas, termas, playas tranquilas, etc.
    - Si el usuario prefiere una mezcla, incluye actividades variadas que cubran diferentes intereses
17. IMPORTANTE: NO incluyas el campo 'imagen' en el JSON de respuesta. Las imágenes se obtendrán mediante una API separada`;
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

          // Limpiar la respuesta de formato markdown y caracteres no deseados
          let respuestaLimpia = respuesta.data
            .replace(/```json\n?/g, '') // Eliminar ```json
            .replace(/```\n?/g, '')     // Eliminar ```
            .replace(/,\s*([}\]])/g, '$1') // Eliminar comas antes de cierres
            .replace(/[^\x20-\x7E\n]/g, '') // Eliminar caracteres no imprimibles
            .trim();

          // Buscar el inicio y fin del JSON
          const inicioJson = respuestaLimpia.indexOf('{');
          const finJson = respuestaLimpia.lastIndexOf('}') + 1;

          if (inicioJson !== -1 && finJson !== 0) {
            respuestaLimpia = respuestaLimpia.substring(inicioJson, finJson);
          }

          try {
            // Intentar parsear la respuesta como JSON
            const respuestaJson = JSON.parse(respuestaLimpia);

            // Agregar mensaje de confirmación al historial y mensajes
            const mensajeConfirmacion = "¡Buena elección! Estamos generando los mejores planes para ti.";
            this.historialConversacion.push({ role: 'assistant', content: mensajeConfirmacion });
            this.mensajes.push({
              texto: mensajeConfirmacion,
              esUsuario: false
            });

            // Actualizar las recomendaciones para el carrusel
            this.recomendaciones = respuestaJson.recomendaciones || [];

            // Obtener imágenes para cada recomendación con delay
            this.recomendaciones.forEach((recomendacion, index) => {
              if (recomendacion.titulo) {
                // Aumentar el delay a 2 segundos entre cada petición
                timer(index * 2000).subscribe(() => {
                  this.chatService.obtenerImagenesLugar(recomendacion.titulo).subscribe({
                    next: (respuestaImagenes) => {
                      if (respuestaImagenes.status === 'success' && respuestaImagenes.data && respuestaImagenes.data.length > 0) {
                        // Tomar el primer link de la lista de imágenes
                        recomendacion.imagen = respuestaImagenes.data[0];
                        console.log('Imagen asignada para:', recomendacion.titulo, 'URL:', recomendacion.imagen);
                      } else {
                        console.warn('No se encontraron imágenes para:', recomendacion.titulo);
                        // Asignar la imagen por defecto desde la carpeta public
                        recomendacion.imagen = 'imagen_actividad.jpg';
                      }
                    },
                    error: (error) => {
                      console.error('Error al obtener imágenes para', recomendacion.titulo, ':', error);
                      // Asignar la imagen por defecto desde la carpeta public
                      recomendacion.imagen = 'imagen_actividad.jpg';
                    }
                  });
                });
              }
            });
          } catch (error) {
            console.error('Error al parsear la respuesta JSON:', error);
            console.log('Respuesta original:', respuesta.data);
            console.log('Respuesta limpia:', respuestaLimpia);

            // Si no es JSON válido, mostrar mensaje de error
            this.mensajes.push({
              texto: 'Lo siento, hubo un error al procesar tu solicitud. Por favor, intenta nuevamente.',
              esUsuario: false
            });
            this.recomendaciones = [];
          }
        },
        error: (error) => {
          // Ocultar animación de escribiendo
          this.estaEscribiendo = false;

          console.error('Error al enviar mensaje:', error);
          this.mensajes.push({
            texto: 'Lo siento, hubo un error al procesar tu mensaje. Por favor, intenta nuevamente.',
            esUsuario: false
          });
          this.recomendaciones = [];
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

  agregarRecomendacion(recomendacion: Recomendacion) {
    const nuevoItinerario: Itinerario = {
      id: Date.now().toString(),
      recomendacion: recomendacion,
      fecha: this.fechaSalida,
      estado: 'pendiente'
    };

    this.itinerarios.push(nuevoItinerario);

    // Mostrar mensaje de éxito
    this.mensajes.push({
      texto: `¡Excelente! Has agregado "${recomendacion.titulo}" a tus itinerarios. Puedes verlo en la sección de itinerarios.`,
      esUsuario: false
    });
  }

  formatearCosto(valor: string | number): string {
    const moneda = this.monedaSeleccionada.label.split(' ')[0];
    const simbolo = this.monedaSeleccionada.label.split(' ')[1].replace(/[()]/g, '');

    // Si el valor es un string, extraer el número
    if (typeof valor === 'string') {
      const numero = parseFloat(valor.replace(/[^0-9.]/g, ''));
      if (isNaN(numero)) return valor;
      return `${simbolo}${numero.toFixed(2)}`;
    }

    // Si el valor es un número
    return `${simbolo}${valor.toFixed(2)}`;
  }

  calcularTotalActividades(actividades: Actividad[]): number {
    return actividades.reduce((total, act) => {
      const costo = parseFloat(act.costo.replace(/[^0-9.]/g, ''));
      return total + (isNaN(costo) ? 0 : costo);
    }, 0);
  }

  calcularTotalComidas(lugaresComida: LugarComida[]): number {
    return lugaresComida.reduce((total, lugar) => {
      const costo = parseFloat(lugar.costoAproximado.replace(/[^0-9.]/g, ''));
      return total + (isNaN(costo) ? 0 : costo);
    }, 0);
  }

  calcularTotalTransporte(costoTransporte: CostoTransporte): number {
    const costoIda = parseFloat(costoTransporte.costoIda.replace(/[^0-9.]/g, ''));
    const costoVuelta = parseFloat(costoTransporte.costoVuelta.replace(/[^0-9.]/g, ''));
    return (isNaN(costoIda) ? 0 : costoIda) + (isNaN(costoVuelta) ? 0 : costoVuelta);
  }

  calcularTotalRecomendacion(recomendacion: Recomendacion): number {
    return this.calcularTotalTransporte(recomendacion.costoTransporte) +
           this.calcularTotalActividades(recomendacion.actividades) +
           this.calcularTotalComidas(recomendacion.lugaresComida);
  }
}
