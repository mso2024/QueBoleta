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
  imports: [HeaderComponent, CommonModule, FormsModule, HttpClientModule]
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

      if (!this.ticketId || !this.userId) {
        console.error('Faltan parámetros necesarios para cargar la página');
        this.router.navigate(['/']); // Redirige al inicio si faltan parámetros
        return;
      }

      this.fetchTicketDetails();
      this.fetchUserFunds();
    });
  }

  fetchTicketDetails(): void {
    this.http.get(`http://localhost:5000/api/facturacion/getTicketDetails/${this.ticketId}`).subscribe(
      (data: any) => {
        if (data && data.length > 0) {
          this.ticketDetails = data[0];
        } else {
          console.error('No se encontraron detalles del boleto');
          this.ticketDetails = null;
        }
      },
      error => console.error('Error fetching ticket details:', error)
    );
  }

  fetchUserFunds(): void {
    this.http.get(`http://localhost:5000/api/usuarios/getUserFunds/${this.userId}`).subscribe(
      (data: any) => {
        this.userFunds = data[0]?.balance || 0;
      },
      error => console.error('Error fetching user funds:', error)
    );
  }

  confirmPurchase(): void {
    this.http.post(`http://localhost:5000/api/facturacion/${this.ticketId}/${this.userId}`, {}).subscribe(
      () => {
        alert('Compra realizada con éxito.');
        this.router.navigate(['/categorias']); // Redirige al usuario al inicio o donde prefieras
      },
      error => {
        console.error('Error processing purchase:', error);
        alert('Ocurrió un error al realizar la compra. Inténtalo de nuevo.');
      }
    );
  }

  cancelPurchase(): void {
    if (this.ticketDetails && this.ticketDetails.evento_nombre && this.ticketDetails.date_id) {
      this.router.navigate([`/tickets/${this.ticketDetails.evento_nombre}/${this.ticketDetails.date_id}`]);
    } else {
      console.error('No se pueden determinar los detalles para regresar');
      this.router.navigate(['/']); // Redirige al inicio si faltan datos
    }
  }
}
