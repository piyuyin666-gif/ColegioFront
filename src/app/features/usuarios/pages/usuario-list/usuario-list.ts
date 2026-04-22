import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Usuario } from '../../models/usuario.model';

import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { UsuarioService } from '../../services/usuario';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NotificationService } from '../../../../core/services/notification';
import { QueryFilter } from '../../../../core/models/query-filter.model';
import { MetaData } from '../../../../core/models/metadata.model';
import { debounceTime, distinctUntilChanged, finalize } from 'rxjs';

@Component({
  selector: 'app-usuario-list',
  standalone: true,
  imports: [
   CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatProgressSpinnerModule

  ],
  templateUrl: './usuario-list.html',
  styleUrl: './usuario-list.css'
})
export class UsuarioListComponent implements OnInit {
   private usuarioService = inject(UsuarioService);
  private notificationService = inject(NotificationService);
  private router = inject(Router);

  usuarios: Usuario[] = [];
  displayedColumns: string[] = ['id', 'nombreUsuario', 'email', 'rol', 'fechaRegistro', 'acciones'];
  loading = false;

  buscarControl = new FormControl('', { nonNullable: true });

  filter: QueryFilter = {
    pageNumber: 1,
    pageSize: 10,
    buscar: ''
  };

  meta: MetaData = {
    totalCount: 0,
    pageSize: 10,
    currentPage: 1,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false
  };

  ngOnInit(): void {
    this.cargarUsuarios();

    this.buscarControl.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged()
      )
      .subscribe(valor => {
        this.filter.buscar = valor;
        this.filter.pageNumber = 1;
        this.cargarUsuarios();
      });
  }

  cargarUsuarios(): void {
    this.loading = true;

    this.usuarioService.getAll(this.filter)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (response) => {
          this.usuarios = response.data;
          this.meta = response.meta;

          console.log(this.usuarios)

        },
        error: () => {
          this.notificationService.error('No se pudo cargar la lista de usuarios.');
        }
      });
  }

  cambiarPagina(event: PageEvent): void {
    this.filter.pageNumber = event.pageIndex + 1;
    this.filter.pageSize = event.pageSize;
    this.cargarUsuarios();
  }

  nuevo(): void {
    this.router.navigate(['/usuarios/nuevo']);
  }

  editar(id: number): void {
    this.router.navigate(['/usuarios/editar', id]);
  }

  eliminar(id: number): void {
    const confirmado = confirm('¿Está seguro de eliminar este usuario?');

    if (!confirmado) {
      return;
    }

    this.loading = true;

    this.usuarioService.delete(id)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: () => {
          this.notificationService.success('Usuario eliminado correctamente.');

          if (this.usuarios.length === 1 && this.filter.pageNumber > 1) {
            this.filter.pageNumber--;
          }

          this.cargarUsuarios();
        },
        error: () => {
          this.notificationService.error('No se pudo eliminar el usuario.');
        }
      });
  }
}
