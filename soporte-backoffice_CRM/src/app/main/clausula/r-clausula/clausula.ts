import { id } from '@swimlane/ngx-datatable';
export interface Clausula {
  id: number;
  nombre: string;
  estado: boolean;
  modulo: {
    id: number;
    nombre: string;
    curso: {
      id: number;
    };
  };
}