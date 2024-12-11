import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule,FormsModule,HttpClientModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  usuarios: any[] = [];
  comentarios: any[] = [];
  selectedComentarioId: number | null = null;
  selectedUsuarioId: number | null = null;
  confirmDelete: boolean = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getUsuarios();
    this.getComentarios();
  }

  getUsuarios() {
    this.http.get<any[]>('/getAllUsuarios').subscribe(
      (data) => {
        this.usuarios = data;
      },
      (error) => {
        console.error('Error al obtener los usuarios:', error);
      }
    );
  }

  getComentarios() {
    this.http.get<any[]>('/getAllComentarios').subscribe(
      (data) => {
        this.comentarios = data;
      },
      (error) => {
        console.error('Error al obtener los comentarios:', error);
      }
    );
  }

  deleteComentario(exp_id: number) {
    this.selectedComentarioId = exp_id;
    this.confirmDelete = true;
  }

  deleteUsuario(user_id: number) {
    this.selectedUsuarioId = user_id;
    this.confirmDelete = true;
  }

  confirmDeletion() {
    if (this.selectedComentarioId !== null) {
      this.http.delete(`/deleteComentario/${this.selectedComentarioId}`).subscribe(
        () => {
          this.comentarios = this.comentarios.filter(comment => comment.exp_id !== this.selectedComentarioId);
          this.resetDeletion();
        },
        (error) => {
          console.error('Error al borrar el comentario:', error);
        }
      );
    } else if (this.selectedUsuarioId !== null) {
      this.http.delete(`/deleteUsuario/${this.selectedUsuarioId}`).subscribe(
        () => {
          this.usuarios = this.usuarios.filter(user => user.user_id !== this.selectedUsuarioId);
          this.resetDeletion();
        },
        (error) => {
          console.error('Error al borrar el usuario:', error);
        }
      );
    }
  }

  cancelDeletion() {
    this.resetDeletion();
  }

  private resetDeletion() {
    this.selectedComentarioId = null;
    this.selectedUsuarioId = null;
    this.confirmDelete = false;
  }
}
