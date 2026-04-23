import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Trimestre } from '../../models/trimestre-model';

import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { TrimestreService } from '../../services/trimestre';
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
  selector: 'app-trimestres-list',
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
  templateUrl: './trimestres-list.html',
  styleUrl: './trimestres-list.css',
})
export class TrimestresListComponent implements OnInit {
  private trimestreService = inject(TrimestreService);
  private notificationService = inject(NotificationService);
  private router = inject(Router);

  trimestres: Trimestre[] = [];
  displayedColumns: string[] = ['id', 'nombre', 'fechaInicio', 'fechaFin', 'acciones'];
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
    this.cargarTrimestres();

    this.buscarControl.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged()
      )
      .subscribe(valor => {
        this.filter.buscar = valor;
        this.filter.pageNumber = 1;
        this.cargarTrimestres();
      });
  }

  cargarTrimestres(): void {
    this.loading = true;

    this.trimestreService.getAll(this.filter)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (response) => {
          this.trimestres = response.data;
          this.meta = response.meta;

          console.log(this.trimestres)

        },
        error: () => {
          this.notificationService.error('No se pudo cargar la lista de trimestres.');
        }
      });
  }

  cambiarPagina(event: PageEvent): void {
    this.filter.pageNumber = event.pageIndex + 1;
    this.filter.pageSize = event.pageSize;
    this.cargarTrimestres();
  }

  nuevo(): void {
    this.router.navigate(['/trimestre/nuevo']);
  }

  editar(id: number): void {
    this.router.navigate(['/trimestres/editar', id]);
  }

  eliminar(id: number): void {
    const confirmado = confirm('¿Está seguro de eliminar este trimestre?');

    if (!confirmado) {
      return;
    }

    this.loading = true;

    this.trimestreService.delete(id)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: () => {
          this.notificationService.success('Trimestre eliminado correctamente.');

          if (this.trimestres.length === 1 && this.filter.pageNumber > 1) {
            this.filter.pageNumber--;
          }

          this.cargarTrimestres();
        },
        error: () => {
          this.notificationService.error('No se pudo eliminar el trimestre.');
        }
      });
  }
}



