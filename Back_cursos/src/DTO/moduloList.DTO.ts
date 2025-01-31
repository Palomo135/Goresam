import { Curso } from "src/modelo/curso.entity";

export class ModuloListDTO {

    id: number;
    nombre: string;
    descripcion: string;
    estado: boolean;
    orden: number;
    curso: Curso;
}