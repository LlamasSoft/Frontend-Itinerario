import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { AuthService, Usuario } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MenubarModule,
    ButtonModule,
    AvatarModule,
    MenuModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'itinerario-frontend';
  items: MenuItem[] = [];
  userMenuItems: MenuItem[] = [];
  usuarioActual: Usuario | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.actualizarMenu();
    this.authService.getUsuarioActual().subscribe(usuario => {
      this.usuarioActual = usuario;
      this.actualizarMenu();
    });
  }

  private actualizarMenu() {
    if (this.usuarioActual) {
      this.items = [
        {
          label: 'Home',
          icon: 'pi pi-home',
          routerLink: '/home'
        },
        {
          label: 'Generar Itinerario',
          icon: 'pi pi-plus',
          routerLink: '/generar-itinerario'
        },
        {
          label: 'Itinerarios',
          icon: 'pi pi-list',
          routerLink: '/itinerarios'
        }
      ];

      this.userMenuItems = [
        {
          label: `${this.usuarioActual.first_name} ${this.usuarioActual.last_name}`,
          icon: 'pi pi-user'
        },
        {
          label: 'Cerrar Sesión',
          icon: 'pi pi-sign-out',
          command: () => this.authService.logout()
        }
      ];
    } else {
      this.items = [
        {
          label: 'Home',
          icon: 'pi pi-home',
          routerLink: '/home'
        },
        {
          label: 'Iniciar Sesión',
          icon: 'pi pi-sign-in',
          routerLink: '/login'
        }
      ];
      this.userMenuItems = [];
    }
  }
}
