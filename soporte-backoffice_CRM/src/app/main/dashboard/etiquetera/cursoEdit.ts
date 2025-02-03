import { DetallePalabraClave } from "./detallePalabraClave";
import { Encargado } from "../Encargado/encargado";
export interface CursoEdit {
    id: number;
    nombre: string;
    descripcion: string;
    logo: Buffer;
    estado: boolean;
    recurso: string;
    fechaInicio: Date;
    fechaCaducidad: Date;
    encargado: Encargado;
    detallePalabrasClave?: DetallePalabraClave[];
}
