import { DetalleModCla } from './../modelo/detalleModCla.entity';
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Clausula } from "src/modelo/clausula.entity";
import { Modulo } from "src/modelo/modulo.entity";
import { Repository } from "typeorm";

@Injectable()
export class DetalleModClaRepository{
    
    constructor(
        @InjectRepository(DetalleModCla) private readonly detalleModClaRepository: Repository<DetalleModCla>,
        @InjectRepository(Clausula) private readonly clausulaRepository: Repository<Clausula>,
        @InjectRepository(Modulo) private readonly moduloRepository: Repository<Modulo>
    ){}

    //obtener todos los detalleModCla , con sus clausulas y modulos
    async findAll(): Promise<DetalleModCla[]>{
        return this.detalleModClaRepository.find({
            where:{estado:true},
            relations:['clausula','modulo'],
        })
    }

    //obtener todos los detalleModCla , con sus clausulas y modulos por id
    async findById(id: number): Promise<DetalleModCla>{
        return this.detalleModClaRepository.findOne({
            where:{id:id,estado:true},
            relations:['clausula','modulo'],
        });
    }

    //crear DetalleModCla
    // async create(detalleModCla: Partial<DetalleModCla>, modulo: Modulo, clausula: Clausula): Promise<DetalleModCla>{
    //     const newDetalle = this.detalleModClaRepository.create({
    //         ...detalleModCla,
    //         modulo: modulo,
    //         clausula: clausula,
    //         fechaCreate: new Date()
    //     });
    //     return this.detalleModClaRepository.save(newDetalle);
    // }
    async create(
        idModulo: number,
        idClausula: number,
      ): Promise<DetalleModCla> {
        const modulo = await this.moduloRepository.findOne({ where: { id: idModulo, estado: true } });
        const clausula = await this.clausulaRepository.findOne({ where: { id: idClausula, estado: true } });
    
        if (!modulo) {
          throw new NotFoundException(`Modulo con ID ${idModulo} no encontrado.`);
        }
    
        if (!clausula) {
          throw new NotFoundException(`Clausula con ID ${idClausula} no encontrada.`);
        }
    
        const detalle = this.detalleModClaRepository.create({
          modulo,
          clausula,
          fechaCreate: new Date(),
        });
    
        return this.detalleModClaRepository.save(detalle);
      }
    

    //actualizar DetalleModCla
    // async update(id: number, detalleModCla: Partial<DetalleModCla>, idModulo: number, idClausula: number): Promise<DetalleModCla>{
    //     const modulo = await this.moduloRepository.findOne({where: {id: idModulo, estado: true}});
    //     const clausula = await this.clausulaRepository.findOne({where: {id: idClausula, estado: true}});
    //     if (!modulo) {
    //         throw new NotFoundException(`Modulo con ID ${idModulo} no encontrado`);
    //       }
    //       if (!clausula) {
    //         throw new NotFoundException(`Clausula con ID ${idClausula} no encontrada`);
          
    //     }

    //     //actualizar DetalleModCla
    //     await this.detalleModClaRepository.update(id,{
    //         ...detalleModCla,
    //         modulo,
    //         clausula,
    //         fechaUpdate: new Date(),
    //     });
    //     return this.findById(id);
    // }
    async update(
        id: number,
        detalleModCla: Partial<DetalleModCla>,
        idModulo?: number,
        idClausula?: number,
      ): Promise<DetalleModCla> {
        const detalle = await this.findById(id);
    
        if (idModulo) {
          const modulo = await this.moduloRepository.findOne({ where: { id: idModulo, estado: true } });
          if (!modulo) {
            throw new NotFoundException(`Modulo con ID ${idModulo} no encontrado.`);
          }
          detalle.modulo = modulo;
        }
    
        if (idClausula) {
          const clausula = await this.clausulaRepository.findOne({
            where: { id: idClausula, estado: true },
          });
          if (!clausula) {
            throw new NotFoundException(`Clausula con ID ${idClausula} no encontrada.`);
          }
          detalle.clausula = clausula;
        }
    
        if (detalleModCla.estado !== undefined) {
          detalle.estado = detalleModCla.estado;
        }
    
        detalle.fechaUpdate = new Date();
        return this.detalleModClaRepository.save(detalle);
      }

    //eliminar DetalleModCla
    async delete(id: number): Promise<void>{
        await this.detalleModClaRepository.update(id, {estado: false});
    }
}