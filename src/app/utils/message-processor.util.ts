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
    moneda: string,
    estadosPorCiudad: { [key: string]: string }
  ): string {
    const diasTexto = diasViaje === 1 ? 'día' : 'días';

    // Crear mapeo de destinos a estados
    const destinosConEstados = selectedDestinos.map(destino =>
      `${destino} (${estadosPorCiudad[destino] || 'Estado no especificado'})`
    ).join(', ');

    return `Contexto del viaje:
- Presupuesto: ${presupuesto} ${moneda}
- Duración: ${diasViaje} ${diasTexto}
- Fecha: ${fechaSalida.toLocaleDateString()}
- Origen: ${selectedCity || 'No especificado'} (${estadosPorCiudad[selectedCity] || 'Estado no especificado'})
- Destinos: ${destinosConEstados || 'No especificados'}
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
   - Si el destino es "Cusco" (departamento), puedes recomendar lugares en "Cusco" (ciudad), "Ollantaytambo", "Pisac", etc.
8. IMPORTANTE: Las recomendaciones deben estar dentro del departamento (estado) especificado para cada destino. Por ejemplo:
   - Si el destino es "Chiclayo" en el departamento de "Lambayeque", todas las recomendaciones deben ser de lugares dentro de Lambayeque
   - Si el destino es "Trujillo" en el departamento de "La Libertad", todas las recomendaciones deben ser de lugares dentro de La Libertad`;
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
    clima: any,
    estadosPorCiudad: { [key: string]: string },
    considerarClima: boolean
  ): string {
    const diasTexto = diasViaje === 1 ? 'día' : 'días';
    const fechaFin = new Date(fechaSalida);
    fechaFin.setDate(fechaFin.getDate() + diasViaje - 1);

    // Crear mapeo de destinos a estados
    const destinosConEstados = selectedDestinos.map(destino =>
      `${destino} (${estadosPorCiudad[destino] || 'Estado no especificado'})`
    ).join(', ');

    let contextoClima = '';
    if (considerarClima) {
      contextoClima = `\nInformación del clima (predicción para los próximos 3 días):
${JSON.stringify(clima, null, 2)}`;
    }

    return `Contexto del viaje:
- Presupuesto: ${presupuesto} ${moneda}
- Duración: ${diasViaje} ${diasTexto}
- Fecha inicio: ${fechaSalida.toLocaleDateString()}
- Fecha fin: ${fechaFin.toLocaleDateString()}
- Origen: ${selectedCity || 'No especificado'} (${estadosPorCiudad[selectedCity] || 'Estado no especificado'})
- Destinos: ${destinosConEstados || 'No especificados'}
- Preferencias: ${preferenciasUsuario.join(', ')}${contextoClima}

Lugares recomendados:
${JSON.stringify(lugares, null, 2)}

Proporciona recomendaciones en formato JSON:

{
  "mensaje": "Respuesta general",
  "itinerarios": [
    {
      "dia": 1,
      "fecha": "YYYY-MM-DD",
      "lugar": "Nombre del lugar principal del día",
      "ciudad": {
        "name": "Nombre de la ciudad",
        "state": {
          "name": "Nombre del estado/departamento"
        },
        "country": {
          "name": "Nombre del país"
        }
      },
      "costo": "Costo total del día",
      "clima": {
        "fecha": "YYYY-MM-DD",
        "ciudad": {
          "name": "Nombre de la ciudad"
        },
        "pais": {
          "name": "Nombre del país"
        },
        "temperatura_maxima": 0,
        "temperatura_minima": 0,
        "estado_clima": "Estado del clima",
        "humedad": 0,
        "probabilidad_lluvia": 0
      },
      "transporte": {
        "tipo_transporte": {
          "nombre": "Nombre del tipo de transporte"
        },
        "nombre": "Nombre específico del transporte"
      },
      "actividades": [
        {
          "turno": "mañana/tarde/noche",
          "orden": 1,
          "lugares": [
            {
              "nombre": "Nombre del lugar",
              "descripcion": "Descripción del lugar",
              "ubicacion": "Ubicación específica",
              "tipo_lugar": {
                "nombre": "Tipo de lugar (museo, restaurante, etc.)"
              }
            }
          ]
        }
      ]
    }
  ]
}

Consideraciones:
1. Si el presupuesto es insuficiente para los destinos seleccionados, sugiere alternativas cercanas al origen que se ajusten al presupuesto
2. Prioriza actividades según preferencias: ${preferenciasUsuario.join(', ')}
3. Incluye opciones de transporte económico si el presupuesto es limitado
4. Especifica claramente qué incluye cada costo
5. Usa nombres específicos de lugares
6. Incluir al menos 2 actividades por día
7. IMPORTANTE: Debes generar un itinerario completo para cada día del viaje
8. IMPORTANTE: Los destinos seleccionados son departamentos. Debes recomendar actividades en ciudades específicas dentro de esos departamentos. Por ejemplo:
   - Si el destino es "Cajamarca" (departamento), puedes recomendar actividades en "Cajamarca" (ciudad), "Celendín", "Chota", etc.
   - Si el destino es "Cusco" (departamento), puedes recomendar actividades en "Cusco" (ciudad), "Ollantaytambo", "Pisac", etc.
9. IMPORTANTE: Las recomendaciones deben estar dentro del departamento (estado) especificado para cada destino. Por ejemplo:
    - Si el destino es "Chiclayo" en el departamento de "Lambayeque", todas las recomendaciones deben ser de lugares dentro de Lambayeque
    - Si el destino es "Trujillo" en el departamento de "La Libertad", todas las recomendaciones deben ser de lugares dentro de La Libertad${considerarClima ? '\n10. IMPORTANTE: Si el viaje es de 3 días o menos, planifica las actividades considerando el clima pronosticado para cada día. Si el viaje es más largo, solo considera el clima para los primeros 3 días.' : ''}
11. IMPORTANTE: Cada día debe tener un itinerario completo y coherente
12. IMPORTANTE: El presupuesto debe distribuirse equitativamente entre los días del viaje
13. IMPORTANTE: Los campos deben coincidir exactamente con los modelos del backend:
    - Turnos: mañana, tarde, noche
    - Tipos de lugar: museo, restaurante, parque, etc.
    - Tipos de transporte: terrestre, aéreo, marítimo, etc.
14. IMPORTANTE: Cada actividad debe tener un orden secuencial dentro de su turno
15. IMPORTANTE: Cada lugar debe tener un tipo_lugar válido`;
  }
}
