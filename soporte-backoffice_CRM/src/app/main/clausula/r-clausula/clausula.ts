export interface Clausula {
  id: number;
  nombre: string;
  descripcion: string;
  estado: boolean;
  moduloId: {
    id: number;
    nombre: string;
  };
}