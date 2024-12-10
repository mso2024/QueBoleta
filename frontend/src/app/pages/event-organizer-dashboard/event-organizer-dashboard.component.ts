import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserDashboardComponent } from '../user-dashboard/user-dashboard.component';
interface Comentario {
  nombrecomentador: string;
  eventname: string;
  contenidocomentario: string;
  calificacion: number;
}

interface Ventas {
  eventonombre: string;
  entradastot: number;
}

@Component({
  selector: 'app-event-organizer-dashboard',
  standalone: true,
  imports: [UserDashboardComponent,CommonModule,FormsModule],
  templateUrl: './event-organizer-dashboard.component.html',
  styleUrls: ['./event-organizer-dashboard.component.scss'],
})
export class EventOrganizerDashboardComponent implements OnInit {
  userId: string | null = null;
  comentarios: Comentario[] = [];
  ventasTotales: Ventas[] = [];
  ingresosTotales: number | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.userId = localStorage.getItem('user_id');
    if (this.userId) {
      this.fetchComentarios();
      this.fetchEntradasTotales();
      this.fetchIngresosTotales();
    }
  }

  fetchComentarios(): void {
    this.http
      .get<Comentario[]>(
        `http://localhost:5000/api/stats/getComentarios/${this.userId}`
      )
      .subscribe({
        next: (data) => {
          this.comentarios = data;
        },
        error: (error) => {
          console.error('Error al obtener comentarios:', error);
        },
      });
  }

  fetchEntradasTotales(): void {
    this.http
      .get<Ventas[]>(
        `http://localhost:5000/api/stats/getEntradasTotales/${this.userId}`
      )
      .subscribe({
        next: (data) => {
          this.ventasTotales = data;
        },
        error: (error) => {
          console.error('Error al obtener entradas totales:', error);
        },
      });
  }

  fetchIngresosTotales(): void {
    this.http
      .get<{ ingresos: number }>(
        `http://localhost:5000/api/stats/getIngresosTotales/${this.userId}`
      )
      .subscribe({
        next: (data) => {
          this.ingresosTotales = data.ingresos;
        },
        error: (error) => {
          console.error('Error al obtener ingresos totales:', error);
        },
      });
  }
}
