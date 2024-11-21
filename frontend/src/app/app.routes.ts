// src/app/app.routes.ts

import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component'; // Adjust based on actual component paths
import { AboutComponent } from './about/about.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ScheduleEventComponent } from './schedule-event/schedule-event.component';
export const appRoutes: Routes = [
  { path: '', component: HomeComponent },  // Default route
  { path: 'about', component: AboutComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'schedule-event', component: ScheduleEventComponent }
];
