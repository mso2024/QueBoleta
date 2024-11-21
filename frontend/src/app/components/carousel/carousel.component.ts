import { Component, OnInit } from '@angular/core';
import { HttpClientModule,HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
@Component({
  standalone: true,
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss'],
  imports:[CommonModule,HttpClientModule]
})
export class CarouselComponent implements OnInit {
  events: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchEvents(); 
  }

  fetchEvents(): void {
    console.log('Fetching events...');  // Add this line to see if the method is called
    const apiUrl = 'http://localhost:5000/api/eventos';
    this.http.get<any[]>(apiUrl).subscribe({
      next: (data) => {
        console.log('Fetched events:', data);  // Log the data when received
        this.events = data;
      },
      error: (err) => {
        console.error('Error fetching events:', err);  // Log errors if any
      },
    });
  }
}  
