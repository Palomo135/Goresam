export interface Clausula {
  id: number;
  nombre: string;
  estado: boolean;
  moduloId: {
    id: number;
    nombre: string;
  };
}