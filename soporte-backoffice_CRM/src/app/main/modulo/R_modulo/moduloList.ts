import { Curso } from '../../dashboard/etiquetera/curso';
export interface ModuloList {

    id: number;
    nombre: string;
    descripcion: string;
    estado: boolean;
    orden: number;
    //idCurso: number;
    curso: Curso;
}