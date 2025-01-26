import { Etiqueta } from "src/modelo/etiqueta.entity";

export interface IEtiquetaServide{
    findAll():Promise<Etiqueta[]>;
    findById(id: number): Promise<Etiqueta>;
    create(etiqueta: Etiqueta): Promise<Etiqueta>;
    update(id: number, etiqueta: Etiqueta): Promise<Etiqueta>;
    delete(id: number): Promise<void>;
}