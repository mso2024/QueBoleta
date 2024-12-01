import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  standalone: true,
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
  imports:[HeaderComponent,CommonModule,FormsModule,HttpClientModule]
})
export class CheckoutComponent implements OnInit {
  ticketId!: string;
  userId!: string;
  ticketDetails: any = {};
  userFunds: number = 0;

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.ticketId = params['ticket_id'];
      this.userId = params['user_id'];
      this.fetchTicketDetails();
      this.fetchUserFunds();
    });
  }

  fetchTicketDetails(): void {
    this.http.get(`http://localhost:5000/api/getTicketPrice/${this.ticketId}`).subscribe(
      (data: any) => this.ticketDetails = data[0],
      error => console.error('Error fetching ticket details:', error)
    );
  }

  fetchUserFunds(): void {
    this.http.get(`http://localhost:5000/api/getUserFunds/${this.userId}`).subscribe(
      (data: any) => this.userFunds = data[0]?.balance || 0,
      error => console.error('Error fetching user funds:', error)
    );
  }

  confirmPurchase(): void {
    this.http.post(`http://localhost:5000/api/checkout/${this.ticketId}/${this.userId}`, {}).subscribe(
      () => {
        alert('Compra realizada con éxito.');
        this.router.navigate(['/']); // Redirige al usuario al inicio o donde prefieras
      },
      error => {
        console.error('Error processing purchase:', error);
        alert('Ocurrió un error al realizar la compra. Inténtalo de nuevo.');
      }
    );
  }

  cancelPurchase(): void {
    this.router.navigate([`/tickets/${this.ticketDetails.evento_nombre}/${this.ticketDetails.date_id}`]);
  }
}
