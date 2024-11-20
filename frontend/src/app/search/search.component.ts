import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  standalone: true,
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  imports: [FormsModule,CommonModule]
})
export class SearchComponent implements OnInit {
  searchQuery: string = '';
  filteredEvents: any[] = [];
  events: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // Fetch events from the API on component initialization
    this.fetchEvents();
  }

  // Fetch events from the backend
  fetchEvents(): void {
    const apiUrl = 'http://localhost:5000/api/eventos'; // Adjust URL if needed
    this.http.get<any[]>(apiUrl).subscribe({
      next: (data) => {
        this.events = data;
        this.filterEvents(); // Filter events when they are fetched
      },
      error: (err) => console.error('Error fetching events:', err),
    });
  }

  // Filter events based on the search query
  filterEvents(): void {
    if (!this.searchQuery.trim()) {
      this.filteredEvents = []; // Hide results if search query is empty
      return;
    }

    this.filteredEvents = this.events.filter((event) => {
      const searchLower = this.searchQuery.toLowerCase();
      return (
        event.event_name.toLowerCase().includes(searchLower) ||
        event.start_time.toLowerCase().includes(searchLower)
      );
    });
  }

  // Watch for changes in the search query and filter accordingly
  onSearchChange(): void {
    this.filterEvents();
  }
}
