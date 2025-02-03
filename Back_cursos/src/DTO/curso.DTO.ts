import { DetallePalabraClave } from "src/modelo/detallePalabraClave.entity";
import { Encargado } from "src/modelo/encargado.entity";
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
    encargado: Encargado;
    detallePalabraClave?: DetallePalabraClave[];
}
