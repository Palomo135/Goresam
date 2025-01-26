import { DetalleModCla } from '../../modelo/detalleModCla.entity';
import { DetalleModClaRepository } from '../../repository/detalleModCla.repository';
import { Injectable } from "@nestjs/common";
import { Modulo } from 'src/modelo/modulo.entity';
import { Clausula } from 'src/modelo/clausula.entity';

@Injectable()
export class DetalleModClaService{
    constructor(private readonly detalleModClaRepository: DetalleModClaRepository){}

    //obtener todas los detalles
    async findAll(): Promise<DetalleModCla[]>{
        return this.detalleModClaRepository.findAll();
    }

    //Obtener detalle por id
    async findById(id: number): Promise<DetalleModCla> {
        return this.detalleModClaRepository.findById(id);
    }

    //crear detalle
    // async create(detalleModCla: Partial<DetalleModCla>, modulo: Modulo, clausula: Clausula): Promise<DetalleModCla> {
    //     return this.detalleModClaRepository.create(detalleModCla, modulo, clausula);
    // }
    async create(
        idModulo: number,
        idClausula: number,
       
      ): Promise<DetalleModCla> {
        return this.detalleModClaRepository.create(idModulo, idClausula);
      }

    //actualizar detalle
    // async update(id: number, detalleModCla: Partial<DetalleModCla>, idModulo: number, idClausula: number): Promise<DetalleModCla> {
    //     return this.detalleModClaRepository.update(id, detalleModCla, idModulo, idClausula);
    // }
    async update(
        id: number,
        detalleModCla: Partial<DetalleModCla>,
        idModulo?: number,
        idClausula?: number,
      ): Promise<DetalleModCla> {
        return this.detalleModClaRepository.update(id, detalleModCla, idModulo, idClausula);
      }

    //Eliminar detalle
    async delete(id: number): Promise<void> {
        return this.detalleModClaRepository.delete(id);
    }
}