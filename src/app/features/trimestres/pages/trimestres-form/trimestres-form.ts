import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { TrimestreService } from '../../services/trimestre';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NotificationService } from '../../../../core/services/notification';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-trimestres-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './trimestres-form.html',
  styleUrl: './trimestres-form.css',
})
export class TrimestresForm implements OnInit{
  private fb = inject(FormBuilder);
    private trimestreService = inject(TrimestreService);
    private notificationService = inject(NotificationService);
    private router = inject(Router);
    private route = inject(ActivatedRoute);
  
    editando = false;
    trimestreId = 0;
    titulo = 'Nuevo trimestre';
    loading = false;
  
    form = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(100)]],
      fechaInicio: [null as any, [Validators.required]],
      fechaFin: [null as any, [Validators.required]]
    });
  
    ngOnInit(): void {
      const id = this.route.snapshot.paramMap.get('id');
  
      if (id) {
        this.editando = true;
        this.trimestreId = Number(id);
        this.titulo = 'Editar trimestre';
  
        this.form.get('clave')?.clearValidators();
        this.form.get('clave')?.updateValueAndValidity();
  
        this.cargarTrimestre(this.trimestreId);
      } else {
        this.form.get('clave')?.setValidators([Validators.required, Validators.minLength(6)]);
        this.form.get('clave')?.updateValueAndValidity();
      }
    }
  
    cargarTrimestre(id: number): void {
      this.loading = true;
  
      this.trimestreService.getById(id)
        .pipe(finalize(() => this.loading = false))
        .subscribe({
          next: trimestre => {
            this.form.patchValue({
              nombre: trimestre.nombre,
              fechaInicio: trimestre.FechaInicio,
              fechaFin: trimestre.FechaFin,
            });
          },
          error: () => {
            this.notificationService.error('No se pudo cargar el trimestre.');
            this.router.navigate(['/trimestres']);
          }
        });
    }
  
    guardar(): void {
      if (this.form.invalid) {
        this.form.markAllAsTouched();
        this.notificationService.error('Complete correctamente el formulario.');
        return;
      }
  
      if (this.editando) {
        this.actualizar();
      } else {
        this.crear();
      }
    }
  
    crear(): void {
      const data = {
        nombre: this.form.value.nombre!,
        FechaInicio: this.form.value.fechaInicio!,
        FechaFin: this.form.value.fechaFin!
      };
  
      this.loading = true;
  
      this.trimestreService.create(data)
        .pipe(finalize(() => this.loading = false))
        .subscribe({
          next: () => {
            this.notificationService.success('Trimestre creado correctamente.');
            this.router.navigate(['/trimestres']);
          },
          error: (error) => {
            const mensaje = error?.error?.mensaje || 'No se pudo crear el trimestre.';
            this.notificationService.error(mensaje);
          }
        });
    }
  
    actualizar(): void {
      const data = {
        id: this.trimestreId,
        nombre: this.form.value.nombre!,
        FechaInicio: this.form.value.fechaInicio!,
        FechaFin: this.form.value.fechaFin!
      };
  
      this.loading = true;
  
      this.trimestreService.update(this.trimestreId, data)
        .pipe(finalize(() => this.loading = false))
        .subscribe({
          next: () => {
            this.notificationService.success('Trimestre actualizado correctamente.');
            this.router.navigate(['/trimestres']);
          },
          error: (error) => {
            const mensaje = error?.error?.mensaje || 'No se pudo actualizar el trimestre.';
            this.notificationService.error(mensaje);
          }
        });
    }
  
    cancelar(): void {
      this.router.navigate(['/trimestres']);
    }
  }
  