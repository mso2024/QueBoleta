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
    fecha_hora_inicio: '', fecha_hora_fin: '', ubicacion: '', capacidad: 0, date_id: 0,
    event_id: 0
  }; 
  event: Evento = { eventid: '', nombre: '', descripcion: '' }; 

  // Nueva propiedad para agregar un nuevo tipo de boleta
  boleta: any = {}; // Propiedad para manejar el nuevo tipo de boleta

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
    console.log('Token: ', token);
    return new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  fetchEventos(): void {
    this.http
      .get<Evento[]>(`http://localhost:5000/api/usuarios/getUserEvents/${this.userId}`, { headers: this.getAuthHeaders() })
      .subscribe({
        next: (data) => {
          this.eventos = data;
        },
        error: (error) => {
          console.error('Error al obtener eventos:', error);
        },
      });
  }

  fetchComentarios(): void {
    this.http
      .get<Comentario[]>(
        `http://localhost:5000/api/stats/getComentarios/${this.userId}`,
        { headers: this.getAuthHeaders() }
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
        `http://localhost:5000/api/stats/getEntradasTotales/${this.userId}`,
        { headers: this.getAuthHeaders() }
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
        `http://localhost:5000/api/stats/getIngresosTotales/${this.userId}`,
        { headers: this.getAuthHeaders() }
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

  addEvent(): void {
    if (!this.event.nombre || !this.event.descripcion || !this.userId) {
      console.error('Todos los campos son obligatorios.');
      return;
    }

    this.http.post('http://localhost:5000/api/eventos/addEvent', 
      { ...this.event, userId: this.userId }, 
      { headers: this.getAuthHeaders() })  // Añadir los encabezados aquí
      .subscribe(
        (response) => {
          console.log('Evento agregado exitosamente', response);
          // Aquí puedes agregar lógica para manejar la respuesta exitosa
        },
        (error) => {
          console.error('Error al agregar evento', error);
        }
      );
  }

  addEventDate(): void {
    // Verificar que los campos están completos
    if (!this.date.fecha_hora_inicio || !this.date.fecha_hora_fin || !this.date.capacidad || !this.date.ubicacion || !this.date.event_id) {
      console.error('Todos los campos son obligatorios.');
      return;
    }
  
    // Aquí ya no necesitamos selectedEventId, sino que obtenemos directamente event_id desde this.date
    const eventId = this.date.event_id;
  
    this.http.post(`http://localhost:5000/api/eventos/addEventDate/${eventId}`, this.date, 
      { headers: this.getAuthHeaders() })  // Añadir los encabezados aquí
      .subscribe(
        (response) => {
          console.log('Fecha de evento agregada exitosamente', response);
          // Aquí puedes agregar lógica para manejar la respuesta exitosa
        },
        (error) => {
          console.error('Error al agregar fecha de evento', error);
        }
      );
  }
  
  

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
          this.boletas = data; // Asignamos las boletas recibidas
        },
        error: (error) => {
          console.error('Error al obtener boletas:', error);
        },
      });
  }

  // Método para agregar un nuevo tipo de boleta
  addTicketType(): void {
    // Verificar que los campos están completos
    if (!this.boleta.nombre || !this.boleta.descripcion || !this.boleta.precio || !this.boleta.date_id) {
      console.error('Todos los campos son obligatorios.');
      return;
    }
  
    // Enviar los datos del formulario junto con el date_id
    const ticketData = {
      nombre: this.boleta.nombre,
      descripcion: this.boleta.descripcion,
      precio: this.boleta.precio
    };
  
    this.http.post(`http://localhost:5000/api/eventos/addTicketType/${this.boleta.date_id}`, ticketData, 
      { headers: this.getAuthHeaders() })  // Añadir los encabezados aquí
      .subscribe(
        (response) => {
          console.log('Tipo de boleto agregado exitosamente', response);
        },
        (error) => {
          console.error('Error al agregar tipo de boleto', error);
        }
      );
  }

  fetchEventDates(): void {
    if (!this.search_event_name) {
      console.error('El nombre del evento es obligatorio');
      return;
    }
  
    this.http.get<Date[]>(`http://localhost:5000/api/eventos/events/${encodeURIComponent(this.search_event_name)}`)
      .subscribe(
        (response) => {
          this.eventDates = response; // Asignar los resultados a eventDates
          console.log('Fechas de evento obtenidas exitosamente', response);
        },
        (error) => {
          console.error('Error al obtener las fechas de evento', error);
          this.eventDates = []; // Limpiar las fechas si hay un error
        }
      );
  }
  
  
  
  
  
  
}
