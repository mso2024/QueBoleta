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
    this.fetchTopEvents(); 
  }

  fetchTopEvents(): void {
    const apiUrl = 'http://localhost:5000/api/stats/top_sale_ranks';
    this.http.get<any[]>(apiUrl).subscribe({
      next:(data) =>{
        console.log('Eventos pulleados: ', data);
        this.events = data;
      },
      error:(error) =>{
        console.error('Error obteniendo los eventos: ', error);
      },
    });
  }
}  
