export interface UsuarioUpdate {
  id: number;
  nombreUsuario: string;
  email: string;
  clave?: string | null;
  rol: string;
}
