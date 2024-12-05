import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

interface Recibo {
  id_recibo: number;
  id_entrada: number;
  payment_method_id: number;
  monto: number;
  fecha_transaccion: string;
  estado_transaccion: string;
  tipo_transaccion: string;
}

interface Tiquete {
  ticket_id: number;
  id_cliente: number;
  id_entrada: number;
  fecha_compra: string;
}

interface MetodoPago {
  user_id: number;
  payment_method_id: number;
  no_tarjeta: number;
  fecha_exp: string;
}

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [HttpClientModule, RouterModule,FormsModule,CommonModule],
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.scss'],
})
export class UserDashboardComponent implements OnInit {
  recibos: Recibo[] = [];
  tiquetes: Tiquete[] = [];
  tarjetas: MetodoPago[] = [];
  user_id: any;
  balance: number = 0;
  amount: number = 0;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.user_id = localStorage.getItem('user_id');
    this.fetchRecibos();
    this.fetchEntradas();
    this.fetchMetodosPago();
    this.fetchUserBalance();
  }

  fetchRecibos(): void {
    this.http
      .get<Recibo[]>(`http://localhost:5000/api/usuarios/getUserRecibos/${this.user_id}`)
      .subscribe(
        (data) => (this.recibos = data),
        (error) => console.error('Error fetching recibos: ', error)
      );
  }

  fetchEntradas(): void {
    this.http
      .get<Tiquete[]>(`http://localhost:5000/api/usuarios/getUserTickets/${this.user_id}`)
      .subscribe(
        (data) => (this.tiquetes = data),
        (error) => console.error('Error fetching tiquetes: ', error)
      );
  }

  fetchMetodosPago(): void {
    this.http
      .get<MetodoPago[]>(`http://localhost:5000/api/usuarios/getUserPaymentMethods/${this.user_id}`)
      .subscribe(
        (data) => (this.tarjetas = data),
        (error) => console.error('Error fetching payment methods: ', error)
      );
  }

  fetchUserBalance(): void {
    this.http
      .get<any>(`http://localhost:5000/api/usuarios/getUserFunds/${this.user_id}`)
      .subscribe(
        (data) => (this.balance = data[0].balance),
        (error) => console.error('Error fetching balance: ', error)
      );
  }

  actualizarBalance(monto: number): void {
    const paymentMethodId = 1; // Hardcoded for example. You might need to select one from available methods.
    this.http
      .post<any>(
        `http://localhost:5000/api/usuarios/updateUserBalance/${this.user_id}/${monto}/${paymentMethodId}`,
        {}
      )
      .subscribe(
        (data) => {
          console.log('Balance updated successfully');
          this.fetchUserBalance(); // Refresh the balance
        },
        (error) => console.error('Error updating balance: ', error)
      );
  }
}
