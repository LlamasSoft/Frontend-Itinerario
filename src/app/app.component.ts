import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { TestService } from './services/test.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'itinerario-frontend';
  backendResponse: any;
  error: string = '';

  constructor(private testService: TestService) {}

  ngOnInit() {
    this.testBackend();
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
