import { Recomendacion, Actividad, LugarComida, CostoTransporte } from '../interfaces/recomendaciones.interface';

export class FormattersUtil {
  static formatearCosto(valor: string | number, simbolo: string): string {
    // Si el valor es un string, extraer el número
    if (typeof valor === 'string') {
      const numero = parseFloat(valor.replace(/[^0-9.]/g, ''));
      if (isNaN(numero)) return valor;
      return `${simbolo}${numero.toFixed(2)}`;
    }

    // Si el valor es un número
    return `${simbolo}${valor.toFixed(2)}`;
  }

  static calcularTotalActividades(actividades: Actividad[]): number {
    return actividades.reduce((total, act) => {
      const costo = parseFloat(act.costo.replace(/[^0-9.]/g, ''));
      return total + (isNaN(costo) ? 0 : costo);
    }, 0);
  }

  static calcularTotalComidas(lugaresComida: LugarComida[]): number {
    return lugaresComida.reduce((total, lugar) => {
      const rangoPrecios = lugar.costoAproximado.match(/(\d+)-(\d+)/);
      if (rangoPrecios) {
        const costoMaximo = parseFloat(rangoPrecios[2]);
        return total + (isNaN(costoMaximo) ? 0 : costoMaximo);
      } else {
        const costo = parseFloat(lugar.costoAproximado.replace(/[^0-9.]/g, ''));
        return total + (isNaN(costo) ? 0 : costo);
      }
    }, 0);
  }

  static calcularTotalTransporte(costoTransporte: CostoTransporte): number {
    const costoIda = parseFloat(costoTransporte.costoIda.replace(/[^0-9.]/g, ''));
    const costoVuelta = parseFloat(costoTransporte.costoVuelta.replace(/[^0-9.]/g, ''));
    return (isNaN(costoIda) ? 0 : costoIda) + (isNaN(costoVuelta) ? 0 : costoVuelta);
  }

  static calcularTotalRecomendacion(recomendacion: Recomendacion): number {
    return this.calcularTotalTransporte(recomendacion.costoTransporte) +
           this.calcularTotalActividades(recomendacion.actividades) +
           this.calcularTotalComidas(recomendacion.lugaresComida);
  }
}
