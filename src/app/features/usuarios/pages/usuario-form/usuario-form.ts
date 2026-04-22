import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { UsuarioService } from '../../services/usuario';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NotificationService } from '../../../../core/services/notification';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-usuario-form',
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
  templateUrl: './usuario-form.html',
  styleUrl: './usuario-form.css'
})
export class UsuarioFormComponent implements OnInit  {
   private fb = inject(FormBuilder);
  private usuarioService = inject(UsuarioService);
  private notificationService = inject(NotificationService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  editando = false;
  usuarioId = 0;
  titulo = 'Nuevo usuario';
  loading = false;

  form = this.fb.group({
    nombreUsuario: ['', [Validators.required, Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email]],
    clave: [''],
    rol: ['', [Validators.required]]
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.editando = true;
      this.usuarioId = Number(id);
      this.titulo = 'Editar usuario';

      this.form.get('clave')?.clearValidators();
      this.form.get('clave')?.updateValueAndValidity();

      this.cargarUsuario(this.usuarioId);
    } else {
      this.form.get('clave')?.setValidators([Validators.required, Validators.minLength(6)]);
      this.form.get('clave')?.updateValueAndValidity();
    }
  }

  cargarUsuario(id: number): void {
    this.loading = true;

    this.usuarioService.getById(id)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: usuario => {
          this.form.patchValue({
            nombreUsuario: usuario.nombreUsuario,
            email: usuario.email,
            rol: usuario.rol,
            clave: ''
          });
        },
        error: () => {
          this.notificationService.error('No se pudo cargar el usuario.');
          this.router.navigate(['/usuarios']);
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
      nombreUsuario: this.form.value.nombreUsuario!,
      email: this.form.value.email!,
      clave: this.form.value.clave!,
      rol: this.form.value.rol!
    };

    this.loading = true;

    this.usuarioService.create(data)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: () => {
          this.notificationService.success('Usuario creado correctamente.');
          this.router.navigate(['/usuarios']);
        },
        error: (error) => {
          const mensaje = error?.error?.mensaje || 'No se pudo crear el usuario.';
          this.notificationService.error(mensaje);
        }
      });
  }

  actualizar(): void {
    const data = {
      id: this.usuarioId,
      nombreUsuario: this.form.value.nombreUsuario!,
      email: this.form.value.email!,
      clave: this.form.value.clave || null,
      rol: this.form.value.rol!
    };

    this.loading = true;

    this.usuarioService.update(this.usuarioId, data)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: () => {
          this.notificationService.success('Usuario actualizado correctamente.');
          this.router.navigate(['/usuarios']);
        },
        error: (error) => {
          const mensaje = error?.error?.mensaje || 'No se pudo actualizar el usuario.';
          this.notificationService.error(mensaje);
        }
      });
  }

  cancelar(): void {
    this.router.navigate(['/usuarios']);
  }
}
