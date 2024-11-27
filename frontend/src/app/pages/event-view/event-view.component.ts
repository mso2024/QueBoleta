import { Component } from '@angular/core';
import { HttpClient,HttpClientModule } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-event-view',
  standalone: true,
  imports: [HttpClientModule, HeaderComponent,FormsModule,CommonModule,RouterModule],
  templateUrl: './event-view.component.html',
  styleUrl: './event-view.component.scss'
})
export class EventViewComponent {
  cat_name!: string;
  events: any[] = [];
  constructor(private route: ActivatedRoute, private http: HttpClient) {}
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.cat_name = params['cat_name'];
      this.fetchEvents();
    });
  }

  fetchEvents(): void {
    this.http.get(`http://localhost:5000/api/eventos/categories/${this.cat_name}`)
      .subscribe(
        (data: any) => this.events = data,
        error => console.error('Error fetching events:', error)
      );
  }

}
