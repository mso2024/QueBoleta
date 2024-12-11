import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserDashboardComponent } from '../user-dashboard/user-dashboard.component';

interface Comentario {
  nombrecomentador: string;
  eventname: string;
  contenidocomentario: string;
  calificacion: number;
}

interface Boleta {
  nombre_ev: string;
  descripcion: string;
  nombre: string;
  precio: number;
}

interface Ventas {
  eventonombre: string;
  entradastot: number;
}

interface Evento {
  eventid: string;
  nombre: string;
  descripcion: string;
}

interface Date {
  fecha_hora_inicio: string;
  fecha_hora_fin: string;
  ubicacion: string;
  capacidad: number;
  event_id: number;
  date_id: number;
}

@Component({
  selector: 'app-event-organizer-dashboard',
  standalone: true,
  imports: [UserDashboardComponent, CommonModule, FormsModule, HttpClientModule],
  templateUrl: './event-organizer-dashboard.component.html',
  styleUrls: ['./event-organizer-dashboard.component.scss'],
})
export class EventOrganizerDashboardComponent implements OnInit {
  userId: string | null = null;
  comentarios: Comentario[] = [];
  ventasTotales: Ventas[] = [];
  boletas: Boleta[] = [];
  ingresosTotales: number | null = null;
  eventos: Evento[] = [];
  eventDates: Date[] = [];
  selectedEventId: string | null = null;
  search_event_name: string | null = null;
  date: Date = {
    fecha_hora_inicio: '',
    fecha_hora_fin: '',
    ubicacion: '',
    capacidad: 0,
    date_id: 0,
    event_id: 0,
  };
  event: Evento = { eventid: '', nombre: '', descripcion: '' };

  boleta: any = {};  // Nuevo tipo de boleta

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.userId = localStorage.getItem('user_id');
    if (this.userId) {
      this.fetchEventos();
      this.fetchComentarios();
      this.fetchEntradasTotales();
      this.fetchIngresosTotales();
      this.fetchBoletas();
    }
  }

  getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : '',
    });
  }

  // Método para obtener todos los eventos del organizador
  fetchEventos(): void {
    this.http
      .get<Evento[]>(`http://localhost:5000/api/usuarios/getUserEvents/${this.userId}`, {
        headers: this.getAuthHeaders(),
      })
      .subscribe({
        next: (data) => {
          this.eventos = data;
        },
        error: (error) => {
          console.error('Error al obtener eventos:', error);
        },
      });
  }

  // Método para obtener los comentarios de un organizador
  fetchComentarios(): void {
    this.http
      .get<Comentario[]>(`http://localhost:5000/api/stats/getComentarios/${this.userId}`, {
        headers: this.getAuthHeaders(),
      })
      .subscribe({
        next: (data) => {
          this.comentarios = data;
        },
        error: (error) => {
          console.error('Error al obtener comentarios:', error);
        },
      });
  }

  // Método para obtener las ventas totales del organizador
  fetchEntradasTotales(): void {
    this.http
      .get<Ventas[]>(`http://localhost:5000/api/stats/getEntradasTotales/${this.userId}`, {
        headers: this.getAuthHeaders(),
      })
      .subscribe({
        next: (data) => {
          this.ventasTotales = data;
        },
        error: (error) => {
          console.error('Error al obtener ventas totales:', error);
        },
      });
  }

  // Método para obtener los ingresos totales del organizador
  fetchIngresosTotales(): void {
    this.http
      .get<{ ingresos: number }>(`http://localhost:5000/api/stats/getIngresosTotales/${this.userId}`, {
        headers: this.getAuthHeaders(),
      })
      .subscribe({
        next: (data) => {
          this.ingresosTotales = data.ingresos;
        },
        error: (error) => {
          console.error('Error al obtener ingresos totales:', error);
        },
      });
  }

  // Método para agregar un nuevo evento
  addEvent(): void {
    if (!this.event.nombre || !this.event.descripcion || !this.userId) {
      console.error('Todos los campos son obligatorios.');
      return;
    }

    this.http
      .post(
        'http://localhost:5000/api/eventos/addEvent',
        { ...this.event, userId: this.userId },
        { headers: this.getAuthHeaders() }
      )
      .subscribe({
        next: (response) => {
          console.log('Evento agregado exitosamente', response);
          this.fetchEventos();  // Actualiza la lista de eventos
        },
        error: (error) => {
          console.error('Error al agregar evento', error);
        },
      });
  }

  // Método para actualizar un evento existente
  updateEvent(event: Evento): void {
    if (!event.nombre || !event.descripcion) {
      console.error('Todos los campos son obligatorios.');
      return;
    }

    this.http
      .put(`http://localhost:5000/api/eventos/modificarEvento/${event.eventid}`, event, {
        headers: this.getAuthHeaders(),
      })
      .subscribe({
        next: (response) => {
          console.log('Evento modificado exitosamente', response);
          this.fetchEventos();  // Actualiza la lista de eventos
        },
        error: (error) => {
          console.error('Error al modificar evento', error);
        },
      });
  }

  // Método para eliminar un evento
  deleteEvent(event: Evento): void {
    this.http
      .delete(`http://localhost:5000/api/eventos/eliminarEvento/${event.eventid}`, {
        headers: this.getAuthHeaders(),
      })
      .subscribe({
        next: (response) => {
          console.log('Evento eliminado exitosamente', response);
          this.fetchEventos();  // Elimina el evento de la lista local
        },
        error: (error) => {
          console.error('Error al eliminar evento', error);
        },
      });
  }

  // Método para obtener los tipos de boletos por evento
  fetchBoletas(): void {
    if (!this.search_event_name) {
      console.error('El nombre del evento es obligatorio');
      return;
    }

    this.http
      .get<Boleta[]>(
        `http://localhost:5000/api/eventos/getTicketTypesbyEventName/${this.search_event_name}`,
        { headers: this.getAuthHeaders() }
      )
      .subscribe({
        next: (data) => {
          this.boletas = data;
        },
        error: (error) => {
          console.error('Error al obtener boletas:', error);
        },
      });
  }

  // Método para agregar un nuevo tipo de boleta
  addTicketType(): void {
    if (!this.boleta.nombre || !this.boleta.descripcion || !this.boleta.precio || !this.boleta.date_id) {
      console.error('Todos los campos son obligatorios.');
      return;
    }

    const ticketData = {
      nombre: this.boleta.nombre,
      descripcion: this.boleta.descripcion,
      precio: this.boleta.precio,
    };

    this.http
      .post(`http://localhost:5000/api/eventos/addTicketType/${this.boleta.date_id}`, ticketData, {
        headers: this.getAuthHeaders(),
      })
      .subscribe({
        next: (response) => {
          console.log('Tipo de boleto agregado exitosamente', response);
        },
        error: (error) => {
          console.error('Error al agregar tipo de boleto', error);
        },
      });
  }

  fetchEventDates(): void {
    if (!this.search_event_name) {
      console.error('El nombre del evento es obligatorio');
      return;
    }
  
    this.http
      .get<Date[]>(`http://localhost:5000/api/eventos/eventDates/${encodeURIComponent(this.search_event_name)}`)
      .subscribe({
        next: (response) => {
          this.eventDates = response;
          console.log('Fechas de evento obtenidas exitosamente', response);
        },
        error: (error) => {
          console.error('Error al obtener las fechas de evento', error);
        },
      });
  }
  

  // Método para agregar una nueva fecha para un evento
  addEventDate(): void {
    if (
      !this.date.fecha_hora_inicio ||
      !this.date.fecha_hora_fin ||
      !this.date.capacidad ||
      !this.date.ubicacion ||
      !this.date.event_id
    ) {
      console.error('Todos los campos son obligatorios.');
      return;
    }

    const eventId = this.date.event_id;

    this.http
      .post(`http://localhost:5000/api/eventos/addEventDate/${eventId}`, this.date, {
        headers: this.getAuthHeaders(),
      })
      .subscribe({
        next: (response) => {
          console.log('Fecha de evento agregada exitosamente', response);
        },
        error: (error) => {
          console.error('Error al agregar fecha de evento', error);
        },
      });
  }
}
