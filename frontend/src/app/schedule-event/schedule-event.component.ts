import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../header/header.component';
@Component({
  selector: 'app-schedule-event',
  standalone: true,
  templateUrl: './schedule-event.component.html',
  styleUrls: ['./schedule-event.component.scss'],
  imports: [FormsModule,HeaderComponent]
})
export class ScheduleEventComponent {
  constructor(private http: HttpClient, private router: Router) {}

  onSubmit() {
    const event = {
      name: 'Sample Event',  // Replace with form values
      description: 'This is a test event.'
    };

    // Replace with your backend API
    this.http.post('/api/eventos/create', event).subscribe(
      response => {
        console.log('Event created successfully!', response);
        this.router.navigate(['/']); // Navigate to another page after success
      },
      error => {
        console.error('Error creating event', error);
      }
    );
  }
}
