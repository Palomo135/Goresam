import { DetallePalabraClaveDTO } from "./detallePalabraClave.DTO";
import { Encargado } from "src/modelo/encargado.entity";
export class CursoEditDTO {
    id: number;
    nombre: string;
    descripcion: string;
    estado: boolean;
    fechaInicio: Date;
    fechaCaducidad: Date;
    encargado: Encargado;
    recurso: string;
    detallePalabraClave: DetallePalabraClaveDTO[];
    logo: string;
}
