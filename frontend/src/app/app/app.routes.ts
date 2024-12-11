import { Routes } from '@angular/router';
import { HomeComponent } from '../pages/home/home.component'; // Adjust based on actual component paths
import { AboutComponent } from '../pages/about/about.component';
import { LoginComponent } from '../pages/login/login.component';
import { RegisterComponent } from '../pages/register/register.component';
import { CategoriesComponent } from '../pages/categories/categories.component';
import { EventViewComponent } from '../pages/event-view/event-view.component';
import { DateViewComponent } from '../pages/date-view/date-view.component';
import { TicketViewComponent } from '../pages/ticket-view/ticket-view.component';
import { CheckoutComponent } from '../pages/checkout/checkout.component';
import { UserDashboardComponent } from '../pages/user-dashboard/user-dashboard.component';
import { EventOrganizerDashboardComponent } from '../pages/event-organizer-dashboard/event-organizer-dashboard.component';
export const appRoutes: Routes = [
  { path: '', component: HomeComponent }, 
  { path: 'about', component: AboutComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'categories', component: CategoriesComponent},
  { path: 'categories/:cat_name', component: EventViewComponent},
  { path: 'events/:event_name', component: DateViewComponent},
  { path: 'tickets/:event_name/:date_id', component: TicketViewComponent},
  { path: 'checkout/:ticket_id/:user_id', component: CheckoutComponent},
  { path: 'user-dashboard', component: UserDashboardComponent},
  { path: 'event-admin-dashboard', component: EventOrganizerDashboardComponent}
];
