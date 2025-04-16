import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-itinerarios',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule],
  templateUrl: './itinerarios.component.html',
  styleUrls: ['./itinerarios.component.css']
})
export class ItinerariosComponent {
  itinerarios = [
    { id: 1, nombre: 'Viaje a Lima', fecha: '2024-03-15', estado: 'Activo' },
    { id: 2, nombre: 'Vacaciones en Cusco', fecha: '2024-04-20', estado: 'Pendiente' }
  ];
}
