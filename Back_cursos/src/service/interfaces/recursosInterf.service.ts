import { Recursos } from './../../modelo/recursos.entity';
import { RecursosDTO } from './../../DTO/recursos.dto';
export interface IRecursosService{
    
    findAll(): Promise<Recursos[]>;
    findById(id: number): Promise<Recursos>;
    create(recurso: Partial<Recursos>): Promise<Recursos>;
    update(id: number, recurso: Partial<Recursos>): Promise<RecursosDTO>;
    delete(id: number): Promise<void>;
}