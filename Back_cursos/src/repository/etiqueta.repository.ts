import { Etiqueta } from '../modelo/etiqueta.entity';
import { Injectable } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from "typeorm";

@Injectable()
export class EtiquetaRepository{

    constructor(
        @InjectRepository(Etiqueta)
        private readonly etiquetaRepository: Repository<Etiqueta>
    ){}

    //obtener todas las etiwuetas
    async findAll(): Promise<Etiqueta[]>{
        return this.etiquetaRepository.find({where:{estado: true}});
    }

    //obtener etiqueta por id
    async findById(id: number): Promise<Etiqueta>{
        return this.etiquetaRepository.findOne({where:{id, estado: true}});
    }

    //crear un nuevo etiqueta
    async create(etiqueta: Etiqueta): Promise<Etiqueta>{
        etiqueta.fechaCreate = new Date();
        return this.etiquetaRepository.save(etiqueta);
    }

    //actualizar un etiqueta
    async update(id: number, etiqueta: Etiqueta): Promise<Etiqueta> {
        try {
            etiqueta.fechaUpdate = new Date();
            // Realizamos la actualización
            await this.etiquetaRepository.update(id, etiqueta);
    
            // Verificamos si el objeto fue actualizado correctamente
            const updatedEtiqueta = await this.etiquetaRepository.findOne({ where: { id } });
    
            if (!updatedEtiqueta) {
                throw new Error(`Etiqueta con id ${id} no encontrada`);
            }
    
            return updatedEtiqueta;
        } catch (error) {
            throw new Error(`Error al actualizar la etiqueta: ${error.message}`);
        }
    }
    
    
    
    //eliminar etiqeuta
    async delete(id: number): Promise<void>{
        await this.etiquetaRepository.update(id, {estado: false});
    }
}