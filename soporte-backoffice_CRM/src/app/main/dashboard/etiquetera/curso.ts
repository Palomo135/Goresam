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
  recurso: string;
  detallePalabrasClave?: DetallePalabraClave[];
}
