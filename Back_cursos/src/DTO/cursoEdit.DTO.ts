import { DetallePalabraClaveDTO } from "./detallePalabraClave.DTO";
export class CursoEditDTO {
    id: number;
    nombre: string;
    descripcion: string;
    estado: boolean;
    fechaCaducidad: Date;
    encargado: string;
    recurso: string;
    detallePalabraClave: DetallePalabraClaveDTO[];
    logo: string;
}
