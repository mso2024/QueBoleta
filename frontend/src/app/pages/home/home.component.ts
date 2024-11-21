// src/app/home/home.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router'
import { HeaderComponent } from '../../components/header/header.component';
import { CarouselComponent } from '../../components/carousel/carousel.component';
import { SearchComponent } from '../../components/search/search.component';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [RouterModule,HeaderComponent,CarouselComponent,SearchComponent]
})
export class HomeComponent {
  constructor(private router: Router) {}

  navigateTo(path: string) {
    this.router.navigate([path]);
  }
}
