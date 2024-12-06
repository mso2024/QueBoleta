import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,FormsModule,HttpClientModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})

export class LoginComponent {
  email: string = '';
  password: string = '';
  error_msg: string = '';
  constructor(private router: Router, private http: HttpClient) { }
  login() {
    this.http.post<any>('http://localhost:5000/api/auth/login',{email: this.email,pwd: this.password})
      .subscribe({
        next:(response) =>{
          localStorage.setItem('token',response.token);
          localStorage.setItem('user_id',response.user_id);
          this.router.navigate(['dashboard']);
        },
        error:(error)=>{
          this.error_msg = error.error?.error || 'An error ocurred';
        }
      });
    }
  }


