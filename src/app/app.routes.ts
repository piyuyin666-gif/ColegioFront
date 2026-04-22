import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';

const loadLoginComponent = () =>
  import('./features/auth/pages/login/login').then(m => m.Login);

const loadUsuarioFormComponent = () =>
  import('./features/usuarios/pages/usuario-form/usuario-form').then(m => m.UsuarioFormComponent);

const loadUsuarioListComponent = () =>
  import('./features/usuarios/pages/usuario-list/usuario-list').then(m => m.UsuarioListComponent);

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: loadLoginComponent
  },
  {
    path: 'usuarios',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: loadUsuarioListComponent
      },
      {
        path: 'nuevo',
        loadComponent: loadUsuarioFormComponent
      },
      {
        path: 'editar/:id',
        loadComponent: loadUsuarioFormComponent
      }
    ]
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];

