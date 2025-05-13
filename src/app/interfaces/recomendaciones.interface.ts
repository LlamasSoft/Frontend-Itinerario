export interface Actividad {
  nombre: string;
  descripcion: string;
  costo: string;
  duracion: string;
  incluye: string[];
  noIncluye: string[];
}

export interface LugarComida {
  nombre: string;
  tipo: string;
  descripcion: string;
  costoAproximado: string;
  horario: string;
  ubicacion: string;
  especialidad: string;
}

export interface CostoTransporte {
  tipoTransporte: string;
  costoIda: string;
  costoVuelta: string;
  duracionViaje: string;
  frecuencia: string;
  puntoPartida: string;
  puntoLlegada: string;
  observaciones: string;
}

export interface Recomendacion {
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

export interface Itinerario {
  id: string;
  recomendacion: Recomendacion;
  fecha: Date;
  estado: 'pendiente' | 'confirmado' | 'completado';
}
