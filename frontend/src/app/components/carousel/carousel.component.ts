import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss'],
  imports: [CommonModule],
})
export class CarouselComponent {
  @Input() events: any[] = []; // Receive events dynamically as input

  scrollLeft() {
    const carousel = document.querySelector('.carousel-content') as HTMLElement;
    carousel.scrollBy({ left: -300, behavior: 'smooth' });
  }

  scrollRight() {
    const carousel = document.querySelector('.carousel-content') as HTMLElement;
    carousel.scrollBy({ left: 300, behavior: 'smooth' });
  }
}
