import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

interface Recibo{
  id_recibo: number;
  id_entrada: number;
  payment_method_id: number;
  monto: number; 
  fecha_transaccion: string;
  estado_transaccion: string;
  tipo_transaccion: string;
}

interface Tiquete{
  ticket_id: number;
  id_cliente: number;
  id_entrada: number;
  fecha_compra: string;
}

interface MetodoPago{
  user_id: number;
  payment_method_id: number;
  no_tarjeta: number;
  fecha_exp: string;
}

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [HttpClientModule,RouterModule],
  templateUrl: './user-dashboard.component.html',
  styleUrl: './user-dashboard.component.scss'
})

export class UserDashboardComponent {
  recibos: Recibo[] = [];
  tiquetes: Tiquete[] = [];
  tarjetas: MetodoPago[] = [];
  user_id: any;
  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.user_id = localStorage.getItem('user_id');
    this.fetchRecibos();
    this.fetchEntradas();
    this.fetchMetodosPago();
  }

  fetchRecibos(): void{
    this.http.get<Recibo[]>(`http://localhost:5000/api/usuarios/getUserRecibos/${this.user_id}`).subscribe(
      (data) => this.recibos = data,
      error => console.error('Error pulleando los recibos: ', error)
    );
  }

  fetchEntradas(): void{
    this.http.get<Tiquete[]>(`http://localhost:5000/api/usuarios/getUserTickets/${this.user_id}`).subscribe(
      (data) => this.tiquetes = data,
      error => console.error('Error pulleando los tiquetes del usuario: ', error)
    );
  }

  fetchMetodosPago(): void{
    this.http.get<MetodoPago[]>(`http://localhost:5000/api/usuarios/getUserPaymentMethods/${this.user_id}`)
  }

  actualizarBalance(monto: number): void{
    

  }
}
