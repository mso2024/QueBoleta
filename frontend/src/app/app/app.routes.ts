// src/app/app.routes.ts

import { Routes } from '@angular/router';
import { HomeComponent } from '../pages/home/home.component'; // Adjust based on actual component paths
import { AboutComponent } from '../about/about.component';
import { LoginComponent } from '../pages/login/login.component';
import { RegisterComponent } from '../pages/register/register.component';
import { ScheduleEventComponent } from '../components/schedule-event/schedule-event.component';
export const appRoutes: Routes = [
  { path: '', component: HomeComponent },  // Default route
  { path: 'about', component: AboutComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'schedule-event', component: ScheduleEventComponent }
];
