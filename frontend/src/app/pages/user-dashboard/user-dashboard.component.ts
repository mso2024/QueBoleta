import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';

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
  event_nombre: string; 
  event_descripcion: string; 
  ticket_nombre: string; 
  fecha_compra: string; 
}

interface MetodoPago {
  payment_method_id: number;
  no_tarjeta: number;
  fecha_exp: string;
}

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [HttpClientModule, RouterModule, FormsModule, CommonModule, HeaderComponent],
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
  selectedPaymentMethodId: number | null = null;

  // Variables para el modal
  newPaymentMethod: MetodoPago = {
    payment_method_id: 0,
    no_tarjeta: 0,
    fecha_exp: ''
  };
  isModalOpen: boolean = false;

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
        (data) => {
          console.log('Fetched Tickets:', data);
          this.tiquetes = data;
        },
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
    if (!this.selectedPaymentMethodId) {
      alert('Por favor selecciona un método de pago.');
      return;
    }

    this.http
      .post<any>(
        `http://localhost:5000/api/usuarios/updateUserBalance/${this.user_id}/${monto}/${this.selectedPaymentMethodId}`,
        {}
      )
      .subscribe(
        () => {
          console.log('Balance updated successfully');
          this.fetchUserBalance();
        },
        (error) => console.error('Error updating balance: ', error)
      );
  }

  // Métodos del Modal
  abrirModal(): void {
    this.isModalOpen = true;
  }

  cerrarModal(): void {
    this.isModalOpen = false;
    this.newPaymentMethod = { payment_method_id: 0, no_tarjeta: 0, fecha_exp: '' }; // Limpiar campos
  }

  agregarMetodoPago(): void {
    if (!this.newPaymentMethod.no_tarjeta || !this.newPaymentMethod.fecha_exp) {
      alert('Por favor ingrese todos los campos.');
      return;
    }

    this.http
      .post<any>('http://localhost:5000/api/usuarios/addPaymentMethod', {
        user_id: this.user_id,
        no_tarjeta: this.newPaymentMethod.no_tarjeta,
        fecha_exp: this.newPaymentMethod.fecha_exp,
      })
      .subscribe(
        (data) => {
          console.log('Método de pago agregado correctamente');
          this.fetchMetodosPago(); // Actualizar lista de métodos de pago
          this.cerrarModal(); // Cerrar el modal
        },
        (error) => console.error('Error agregando el método de pago: ', error)
      );
  }
}
