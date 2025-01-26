import { Clausula } from "src/modelo/clausula.entity";
import { Modulo } from "src/modelo/modulo.entity";

export interface IModuloService {

    //  findAll(): Promise<Modulo[]>;
    //  findById(id: number): Promise<Modulo>;
    create(modulo: Modulo, clausula: Clausula): Promise<Modulo>;
    //  update(id:number, modulo: Modulo, clausulaId: number): Promise<Modulo>;
    //  delete(id:number): Promise<void>;
}