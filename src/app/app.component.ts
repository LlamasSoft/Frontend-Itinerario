import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { TestService } from './services/test.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MenubarModule,
    ButtonModule,
    AvatarModule,
    MenuModule  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'itinerario-frontend';
  backendResponse: any;
  error: string = '';
  items = [
    {
      label: 'Home',
      icon: 'pi pi-home',
      routerLink: '/home'
    },
    {
      label: 'Generar Itinerario',
      icon: 'pi pi-compass',
      routerLink: '/generar-itinerario'
    },
    {
      label: 'Itinerarios',
      icon: 'pi pi-list',
      routerLink: '/itinerarios'
    }
  ];

  userMenuItems: MenuItem[] | undefined;

  constructor(private testService: TestService) {}

  ngOnInit() {
    this.testBackend();
    this.userMenuItems = [
      {
        label: 'Mi Perfil',
        icon: 'pi pi-user'
      },
      {
        separator: true
      },
      {
        label: 'Cerrar Sesión',
        icon: 'pi pi-sign-out'
      }
    ];
  }

  testBackend() {
    this.testService.testBackend().subscribe({
      next: (response) => {
        this.backendResponse = response;
        this.error = '';
      },
      error: (err) => {
        this.error = 'Error al conectar con el backend: ' + err.message;
        this.backendResponse = null;
      }
    });
  }
}
