import { DetallePalabraClave } from "./detallePalabraClave";
import { Encargado } from "../Encargado/encargado";
export interface Curso {
  id: number;
  nombre: string;
  descripcion: string;
  logo: Buffer;
  frase?: string;
  dirigido?: string;
  aprendizaje?: string;
  requisitos?: string;
  reconocimiento?: string;
  estado: boolean;
  fechaInicio: Date;
  fechaCaducidad: Date;
  encargado: Encargado;
  recurso: string;
  detallePalabrasClave?: DetallePalabraClave[];
}
