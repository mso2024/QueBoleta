// src/main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app/app.component';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app/app/app.routes'; // Import appRoutes from your app.routes.ts

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(appRoutes),  // Provide the appRoutes to the router
  ],
});
