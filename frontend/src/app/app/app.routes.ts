import { Routes } from '@angular/router';
import { HomeComponent } from '../pages/home/home.component'; // Adjust based on actual component paths
import { AboutComponent } from '../pages/about/about.component';
import { LoginComponent } from '../pages/login/login.component';
import { RegisterComponent } from '../pages/register/register.component';
import { ScheduleEventComponent } from '../components/schedule-event/schedule-event.component';
import { CategoriesComponent } from '../pages/categories/categories.component';
import { EventViewComponent } from '../pages/event-view/event-view.component';
import { DateViewComponent } from '../pages/date-view/date-view.component';
export const appRoutes: Routes = [
  { path: '', component: HomeComponent },  // Default route
  { path: 'about', component: AboutComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'categories', component: CategoriesComponent},
  { path: 'categories/:cat_name', component: EventViewComponent},
  { path: 'events/:event_name', component: DateViewComponent}
];
