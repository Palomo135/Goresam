import { Curso } from '../../dashboard/etiquetera/curso';
export interface ModuloList {

    id: number;
    nombre: string;
    estado: boolean;
    orden: number;
    //idCurso: number;
    Curso: Curso;
}