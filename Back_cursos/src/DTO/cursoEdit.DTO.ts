import { DetallePalabraClave } from "src/modelo/detallePalabraClave.entity";
import { Encargado } from "src/modelo/encargado.entity";
export class CursoEditDTO {
    id: number;
    nombre: string;
    descripcion: string;
    logo?: Buffer;
    estado: string;
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
