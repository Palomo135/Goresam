import { DetallePalabraClave } from "src/modelo/detallePalabraClave.entity";
export class CursoDTO {
    id: number;
    nombre: string;
    descripcion: string;
    logo?: Buffer;
    estado: boolean = true;
    frase?: string;
    dirigido?: string;
    aprendizaje?: string;
    requisitos?: string;
    reconocimiento?: string;
    recurso: string;
    fechaInicio: Date;
    fechaCaducidad: Date;
    encargado: string;
    detallePalabraClave?: DetallePalabraClave[];
}
