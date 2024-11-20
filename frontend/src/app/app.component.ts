// src/app/app.component.ts
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router'; // Import RouterModule
import { HomeComponent } from './home/home.component'; // Import HomeComponent
import { HeaderComponent } from './header/header.component';
import { CarouselComponent } from './carousel/carousel.component';
@Component({
  selector: 'app-root',
  template: `
    

    <router-outlet></router-outlet>  <!-- This is where routed components will display -->
  `,
  standalone: true,
  imports: [RouterModule,HeaderComponent,CarouselComponent], // Include RouterModule here
})
export class AppComponent {}
