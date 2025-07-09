# 🗺️ ItinerarioFrontend

[![Angular](https://img.shields.io/badge/Angular-19.2.0-red.svg)](https://angular.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7.2-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1.4-38B2AC.svg)](https://tailwindcss.com/)
[![PrimeNG](https://img.shields.io/badge/PrimeNG-19.1.0-6366F1.svg)](https://primeng.org/)

Una aplicación web moderna para generar y gestionar itinerarios de viaje personalizados, construida con Angular 19 y diseñada con Tailwind CSS y PrimeNG.

## 📋 Tabla de Contenidos

- [🚀 Características](#-características)
- [🛠️ Tecnologías Utilizadas](#️-tecnologías-utilizadas)
- [📁 Estructura del Proyecto](#-estructura-del-proyecto)
- [⚡ Instalación y Configuración](#-instalación-y-configuración)
- [🎯 Funcionalidades Principales](#-funcionalidades-principales)
- [🔧 Scripts Disponibles](#-scripts-disponibles)
- [🧪 Testing](#-testing)
- [📦 Dependencias](#-dependencias)
- [🤝 Contribución](#-contribución)
- [📄 Licencia](#-licencia)

## 🚀 Características

- **🎨 Interfaz Moderna**: Diseño responsive con Tailwind CSS y PrimeNG
- **🔐 Autenticación**: Sistema de login con guardias de ruta
- **🗺️ Generación de Itinerarios**: Creación personalizada de rutas de viaje
- **📱 Responsive**: Optimizado para dispositivos móviles y desktop
- **📄 Exportación PDF**: Generación de itinerarios en formato PDF
- **🎯 Componentes Reutilizables**: Arquitectura modular y escalable

## 🛠️ Tecnologías Utilizadas

### Frontend Framework
- **[Angular 19](https://angular.io/)** - Framework principal
- **[TypeScript](https://www.typescriptlang.org/)** - Lenguaje de programación
- **[RxJS](https://rxjs.dev/)** - Programación reactiva

### UI/UX
- **[Tailwind CSS](https://tailwindcss.com/)** - Framework CSS utility-first
- **[PrimeNG](https://primeng.org/)** - Biblioteca de componentes UI
- **[PrimeIcons](https://primeng.org/icons)** - Iconografía

### Herramientas de Desarrollo
- **[Angular CLI](https://angular.dev/tools/cli)** - Herramientas de línea de comandos
- **[Karma](https://karma-runner.github.io/)** - Test runner
- **[Jasmine](https://jasmine.github.io/)** - Framework de testing

### Utilidades
- **[jsPDF](https://artskydj.github.io/jsPDF/docs/)** - Generación de PDFs
- **[PostCSS](https://postcss.org/)** - Procesamiento de CSS

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── components/           # Componentes reutilizables
│   │   ├── footer/          # Componente de pie de página
│   │   ├── itinerario-detallado/  # Vista detallada de itinerarios
│   │   ├── recomendacion-detalle/ # Detalles de recomendaciones
│   │   └── recomendaciones-carousel/ # Carrusel de recomendaciones
│   ├── interfaces/          # Definiciones de tipos TypeScript
│   │   └── recomendaciones.interface.ts
│   ├── pages/              # Páginas principales de la aplicación
│   │   ├── configuracion/  # Página de configuración
│   │   ├── home/           # Página principal
│   │   ├── itinerarios/    # Gestión de itinerarios
│   │   ├── landing/        # Página de bienvenida
│   │   └── login/          # Página de autenticación
│   ├── services/           # Servicios de la aplicación
│   │   ├── auth.service.ts      # Servicio de autenticación
│   │   ├── chat.service.ts      # Servicio de chat
│   │   ├── ciudad.service.ts    # Servicio de ciudades
│   │   ├── estado.service.ts    # Servicio de estados
│   │   ├── itinerario.service.ts # Servicio de itinerarios
│   │   └── test.service.ts      # Servicio de pruebas
│   └── utils/              # Utilidades y helpers
│       ├── formatters.util.ts   # Formateadores
│       └── message-processor.util.ts # Procesador de mensajes
├── environments/           # Configuraciones de entorno
└── assets/                # Recursos estáticos
```

## ⚡ Instalación y Configuración

### Prerrequisitos

- **[Node.js](https://nodejs.org/)** (versión 18 o superior)
- **[npm](https://www.npmjs.com/)** o **[yarn](https://yarnpkg.com/)**
- **[Angular CLI](https://angular.dev/tools/cli)** (versión 19.2.7)

### Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <url-del-repositorio>
   cd Frontend-Itinerario
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Iniciar servidor de desarrollo**
   ```bash
   npm start
   ```

4. **Abrir en el navegador**
   Navega a [http://localhost:4200](http://localhost:4200)

## 🎯 Funcionalidades Principales

### 🔐 Sistema de Autenticación
- **Login seguro** con validación de credenciales
- **Guardias de ruta** para proteger páginas privadas
- **Gestión de sesiones** automática

### 🗺️ Generación de Itinerarios
- **Creación personalizada** basada en preferencias
- **Recomendaciones inteligentes** de actividades
- **Cálculo de costos** detallado
- **Opciones de transporte** con precios

### 📱 Gestión de Contenido
- **Vista de itinerarios** organizada
- **Detalles completos** de cada recomendación
- **Exportación a PDF** de itinerarios
- **Configuración personal** de usuario

### 🎨 Interfaz de Usuario
- **Diseño responsive** para todos los dispositivos
- **Componentes modernos** con PrimeNG
- **Navegación intuitiva** entre secciones
- **Carruseles interactivos** para recomendaciones

## 🔧 Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm start` | Inicia el servidor de desarrollo en [http://localhost:4200](http://localhost:4200) |
| `npm run build` | Compila el proyecto para producción en `dist/` |
| `npm run watch` | Compila en modo watch para desarrollo |
| `npm test` | Ejecuta las pruebas unitarias con Karma |
| `ng generate component` | Genera un nuevo componente |
| `ng generate service` | Genera un nuevo servicio |

## 🧪 Testing

### Pruebas Unitarias
```bash
npm test
```

### Pruebas End-to-End
```bash
ng e2e
```

## 📦 Dependencias

### Dependencias Principales
- **@angular/common**: ^19.2.0
- **@angular/core**: ^19.2.0
- **@angular/router**: ^19.2.0
- **primeng**: ^19.1.0
- **tailwindcss**: ^4.1.4
- **jspdf**: ^3.0.1

### Dependencias de Desarrollo
- **@angular/cli**: ^19.2.7
- **@angular-devkit/build-angular**: ^19.2.7
- **typescript**: ~5.7.2
- **karma**: ~6.4.0
- **jasmine-core**: ~5.6.0

## 🤝 Contribución

1. **Fork** el proyecto
2. Crea una **rama** para tu feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. **Push** a la rama (`git push origin feature/AmazingFeature`)
5. Abre un **Pull Request**

### Guías de Contribución
- Sigue las **convenciones de código** de Angular
- Añade **tests** para nuevas funcionalidades
- Actualiza la **documentación** según sea necesario
- Usa **TypeScript** para todo el código nuevo

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

---

## 🔗 Enlaces Útiles

- **[Documentación de Angular](https://angular.dev/)**
- **[Guía de Tailwind CSS](https://tailwindcss.com/docs)**
- **[Componentes PrimeNG](https://primeng.org/components)**
- **[TypeScript Handbook](https://www.typescriptlang.org/docs/)**
- **[RxJS Documentation](https://rxjs.dev/guide/overview)**

## 📞 Soporte

Si tienes preguntas o necesitas ayuda:
- 📧 Crea un **issue** en el repositorio
- 📖 Revisa la **documentación** de Angular
- 🔍 Busca en **Stack Overflow** con el tag `angular`

---

**Desarrollado con ❤️ usando Angular 19**