import { DetallePalabraClaveDTO } from "./detallePalabraClave.DTO";
export class CursoEditDTO {
    id: number;
    nombre: string;
    descripcion: string;
    estado: boolean;
    recurso: string;
    detallePalabraClave: DetallePalabraClaveDTO[];
    logo: string;
}
