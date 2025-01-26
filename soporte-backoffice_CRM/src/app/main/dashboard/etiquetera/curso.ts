import { DetallePalabraClave } from "./detallePalabraClave";
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
  fechaCaducidad: Date;
  Encargado: string;
  recurso: string;
  detallePalabrasClave?: DetallePalabraClave[];
}
