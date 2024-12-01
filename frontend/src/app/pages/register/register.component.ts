import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  email: string = '';
  nombre: string = '';
  apellido: string = '';
  balance: number = 0.0;
  password: string = '';
  rol: string = '';
  msg_ex: string = '';
  msg_err: string = '';

  constructor(private router: Router, private http: HttpClient) { }

  register() {
    // Verificación básica de campos
    if (!this.email || !this.nombre || !this.apellido || !this.rol || !this.password) {
      this.msg_err = 'Todos los campos son obligatorios.';
      return;
    }

    this.http.post<any>('http://localhost:5000/api/auth/register', {
      email: this.email,
      pwd: this.password,  // Enviamos 'pwd' en lugar de 'password'
      rol: this.rol,
      nombre: this.nombre,
      apellido: this.apellido,
      balance: this.balance
    })
    .subscribe({
      next: (response) => {
        this.msg_ex = 'Registro exitoso.';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err: any) => {
        this.msg_err = err.error?.error || 'Hubo un error al registrarse. Por favor intente de nuevo';
      }
    });
  }
}
