export class MessageProcessorUtil {
  static procesarPreferencias(mensaje: string): string[] {
    // Tomar el mensaje completo como preferencia
    return [mensaje.trim()];
  }

  static generarPromptLugares(
    mensajeUsuario: string,
    presupuesto: number,
    diasViaje: number,
    fechaSalida: Date,
    selectedCity: string,
    selectedDestinos: string[],
    preferenciasUsuario: string[],
    moneda: string
  ): string {
    const diasTexto = diasViaje === 1 ? 'día' : 'días';

    return `Contexto del viaje:
- Presupuesto: ${presupuesto} ${moneda}
- Duración: ${diasViaje} ${diasTexto}
- Fecha: ${fechaSalida.toLocaleDateString()}
- Origen: ${selectedCity || 'No especificado'}
- Destinos: ${selectedDestinos.join(', ') || 'No especificados'}
- Preferencias: ${preferenciasUsuario.join(', ')}

Proporciona recomendaciones de lugares en formato JSON:

{
  "mensaje": "Respuesta general",
  "lugares": [
    {
      "nombre": "Nombre del lugar",
      "ciudad": "Nombre de la ciudad (sin paréntesis ni información adicional)",
      "pais": "País",
      "tipo": "Tipo de lugar (museo, parque, restaurante, etc.)",
      "costoAproximado": "Rango de precios",
    }
  ]
}

Consideraciones:
1. Si el presupuesto es insuficiente para los destinos seleccionados, sugiere alternativas cercanas al origen que se ajusten al presupuesto, solo si es insuficiente para los destinos seleccionados
2. Prioriza lugares según preferencias: ${preferenciasUsuario.join(', ')}
3. Incluye al menos 3 lugares por recomendación
4. Usa nombres específicos de lugares
5. Se debe usar todo el presupuesto para los destinos seleccionados, teniendo en cuenta que el presupuesto es el total del viaje
6. IMPORTANTE: El campo "ciudad" debe contener SOLO el nombre de la ciudad, sin paréntesis ni información adicional. Por ejemplo:
   - Correcto: "ciudad": "Lima"
   - Incorrecto: "ciudad": "Lima (capital de Perú)"
   - Incorrecto: "ciudad": "Lunahuana (a 3 horas de Lima)"
7. IMPORTANTE: Los destinos seleccionados son departamentos. Debes recomendar lugares en ciudades específicas dentro de esos departamentos. Por ejemplo:
   - Si el destino es "Cajamarca" (departamento), puedes recomendar lugares en "Cajamarca" (ciudad), "Celendín", "Chota", etc.
   - Si el destino es "Cusco" (departamento), puedes recomendar lugares en "Cusco" (ciudad), "Ollantaytambo", "Pisac", etc.`;
  }

  static generarPromptItinerario(
    mensajeUsuario: string,
    presupuesto: number,
    diasViaje: number,
    fechaSalida: Date,
    selectedCity: string,
    selectedDestinos: string[],
    preferenciasUsuario: string[],
    moneda: string,
    lugares: any[],
    clima: any
  ): string {
    const diasTexto = diasViaje === 1 ? 'día' : 'días';
    const fechaFin = new Date(fechaSalida);
    fechaFin.setDate(fechaFin.getDate() + diasViaje - 1);

    return `Contexto del viaje:
- Presupuesto: ${presupuesto} ${moneda}
- Duración: ${diasViaje} ${diasTexto}
- Fecha inicio: ${fechaSalida.toLocaleDateString()}
- Fecha fin: ${fechaFin.toLocaleDateString()}
- Origen: ${selectedCity || 'No especificado'}
- Destinos: ${selectedDestinos.join(', ') || 'No especificados'}
- Preferencias: ${preferenciasUsuario.join(', ')}

Información del clima:
${JSON.stringify(clima, null, 2)}

Lugares recomendados:
${JSON.stringify(lugares, null, 2)}

Proporciona recomendaciones en formato JSON:

{
  "mensaje": "Respuesta general",
  "recomendaciones": [{
    "titulo": "Nombre específico del lugar",
    "descripcion": "Descripción breve",
    "actividades": [
      {
        "nombre": "Nombre actividad 1",
        "descripcion": "Descripción breve",
        "costo": "Costo con detalles de inclusión",
        "duracion": "Duración",
        "incluye": ["Item 1", "Item 2", "Item N..."],
        "noIncluye": ["Item 1", "Item 2", "Item N..."]
      },
      {
        "nombre": "Nombre actividad 2",
        "descripcion": "Descripción breve",
        "costo": "Costo con detalles de inclusión",
        "duracion": "Duración",
        "incluye": ["Item 1", "Item 2", "Item N..."],
        "noIncluye": ["Item 1", "Item 2", "Item N..."]
      }
    ],
    "lugaresComida": [
      {
        "nombre": "Nombre lugar 1",
        "tipo": "Tipo comida",
        "descripcion": "Descripción breve",
        "costoAproximado": "Rango de precios",
        "horario": "Horario",
        "ubicacion": "Ubicación",
        "especialidad": "Especialidad"
      },
      {
        "nombre": "Nombre lugar 2",
        "tipo": "Tipo comida",
        "descripcion": "Descripción breve",
        "costoAproximado": "Rango de precios",
        "horario": "Horario",
        "ubicacion": "Ubicación",
        "especialidad": "Especialidad"
      }
    ],
    "costoTransporte": {
      "tipoTransporte": "Tipo",
      "costoIda": "Costo ida",
      "costoVuelta": "Costo vuelta",
      "duracionViaje": "Duración",
      "frecuencia": "Frecuencia",
      "puntoPartida": "Origen",
      "puntoLlegada": "Destino",
      "observaciones": "Observaciones"
    },
    "detallesAdicionales": {
      "mejorEpoca": "Época recomendada",
      "recomendaciones": ["Rec 1", "Rec 2"],
      "consideracionesClima": ["Consideración 1", "Consideración 2"]
    }
  }]
}

Consideraciones:
1. Si el presupuesto es insuficiente para los destinos seleccionados, sugiere alternativas cercanas al origen que se ajusten al presupuesto
2. Prioriza actividades según preferencias: ${preferenciasUsuario.join(', ')}
3. Incluye opciones de transporte económico si el presupuesto es limitado
4. Especifica claramente qué incluye cada costo
5. Usa nombres específicos de lugares
6. Incluir al menos 2 actividades y 2 lugares de comida por recomendación
7. Considera el clima pronosticado para cada día al planificar las actividades
8. IMPORTANTE: El campo "ubicacion" en lugaresComida debe contener SOLO el nombre de la ciudad, sin paréntesis ni información adicional
9. IMPORTANTE: Los destinos seleccionados son departamentos. Debes recomendar actividades en ciudades específicas dentro de esos departamentos. Por ejemplo:
   - Si el destino es "Cajamarca" (departamento), puedes recomendar actividades en "Cajamarca" (ciudad), "Celendín", "Chota", etc.
   - Si el destino es "Cusco" (departamento), puedes recomendar actividades en "Cusco" (ciudad), "Ollantaytambo", "Pisac", etc.`;
  }
}
