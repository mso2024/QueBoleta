import { Component } from '@angular/core';
import { HttpClient,HttpClientModule } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-date-view',
  standalone: true,
  imports: [HttpClientModule,HeaderComponent,CommonModule,FormsModule],
  templateUrl: './date-view.component.html',
  styleUrl: './date-view.component.scss'
})
export class DateViewComponent {
  event_name!: string;
  dates: any[] = [];
  constructor(private route: ActivatedRoute, private http: HttpClient) {}
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.event_name = params['event_name'];
      console.log('Event name from route:', this.event_name);  // Add this log
      this.fetchDates();
    });
  }

  fetchDates(): void {
    const encodedEventName = encodeURIComponent(this.event_name); // Ensure URL encoding
    this.http.get(`http://localhost:5000/api/eventos/${encodedEventName}`)
      .subscribe(
        (data: any) => this.dates = data,
        error => console.error('Error fetching events:', error)
      );
  }

}
