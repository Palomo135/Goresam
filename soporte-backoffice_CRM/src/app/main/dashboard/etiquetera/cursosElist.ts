import { Encargado } from "../Encargado/encargado";
export interface CursoElistDTO {
    id: number;
    nombre: string;
    logo: string;
    fechaInicio: Date;
    fechaCaducidad: Date;
    encargado: Encargado;
}