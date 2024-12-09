import { Component } from '@angular/core';
import { UserDashboardComponent } from '../user-dashboard/user-dashboard.component';

interface Comentario{
  nombrecomentador: string;
  eventname: string;
  contenidocomentario: string;
  calificacion: number;
}

interface Ventas{
  eventonombre: string;
  entradastot: number;
}

@Component({
  selector: 'app-event-organizer-dashboard',
  standalone: true,
  imports: [UserDashboardComponent],
  templateUrl: './event-organizer-dashboard.component.html',
  styleUrl: './event-organizer-dashboard.component.scss'
})

export class EventOrganizerDashboardComponent {




}
