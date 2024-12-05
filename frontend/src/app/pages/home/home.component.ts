// src/app/home/home.component.ts
import { Component, OnInit } from '@angular/core';
import { HttpClient,HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { CarouselComponent } from '../../components/carousel/carousel.component';
import { SearchComponent } from '../../components/search/search.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [RouterModule, HeaderComponent, CarouselComponent, SearchComponent,HttpClientModule],
})
export class HomeComponent implements OnInit {
  popularEvents: any[] = [];

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchPopularEvents();
  }

  fetchPopularEvents(): void {
    const apiUrl = 'http://localhost:5000/api/stats/top_sale_ranks';
    this.http.get<any[]>(apiUrl).subscribe({
      next: (data) => {
        console.log('Popular events fetched:', data);
        this.popularEvents = data;
      },
      error: (error) => {
        console.error('Error fetching popular events:', error);
      },
    });
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
  }
}
