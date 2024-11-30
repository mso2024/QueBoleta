import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-ticket-view',
  standalone: true,
  imports: [HttpClientModule, HeaderComponent, CommonModule, FormsModule, RouterModule],
  templateUrl: './ticket-view.component.html',
  styleUrls: ['./ticket-view.component.scss']  
})
export class TicketViewComponent {
  event_name!: string;
  date_id!: any;
  tickets: any[] = [];
  userId!: string;  // Definir el userId aquí

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.event_name = params['event_name'];
      this.date_id = params['date_id'];
      this.userId = localStorage.getItem('user_id') || ''; 
      if(!this.userId){
        this.router.navigate(['/login']);
        return;
      }
      console.log('Event name/date_id from route:', this.event_name, '/', this.date_id);  
      console.log('User ID:', this.userId);  // Verificar el userId
      this.fetch_tickets();
    });
  }

  fetch_tickets(): void {
    this.http.get(`http://localhost:5000/api/eventos/tickets/${this.event_name}/${this.date_id}`)  
      .subscribe(
        (data: any) => this.tickets = data,
        error => console.error('Error fetching tickets:', error)
      );
  }
}
