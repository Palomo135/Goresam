import { CreateModuloDTO } from './modulo.DTO';

export class Clausula {
    id: number;
    nombre: string;
    descripcion: string;
    modulo: CreateModuloDTO;
    fechaCreate: Date;
    fechaUpdate: Date;
    estado: boolean;
}
