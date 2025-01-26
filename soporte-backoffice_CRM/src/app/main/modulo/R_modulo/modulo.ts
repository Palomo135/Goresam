export interface Modulo {
  id?: number;
  nombre: string;
  //descripcion: string;
  cursoId: number; // Relación con Curso
  orden: number;
  estado: boolean;
}
