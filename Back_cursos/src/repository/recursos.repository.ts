import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Recursos } from './../modelo/recursos.entity';

@Injectable()
export class RecursosRepository {
  constructor(
    @InjectRepository(Recursos)
    private readonly recursosRepository: Repository<Recursos>,
  ) {}

  // Obtener todos los recursos
  async findAll(): Promise<Recursos[]> {
    return this.recursosRepository.find({ where: { estado: true } });
  }

  // Obtener recurso por ID
  async findById(id: number): Promise<Recursos> {
    return this.recursosRepository.findOne({ where: { id, estado: true } });
  }

  // Crear un nuevo recurso
  async create(recurso: Partial<Recursos>): Promise<Recursos> {
    const newRecurso = this.recursosRepository.create(recurso);
    return this.recursosRepository.save(newRecurso);
  }

  // Actualizar un recurso
  async update(id: number, recurso: Partial<Recursos>): Promise<Recursos> {
    await this.recursosRepository.update(id, recurso); // Actualiza los campos
    return this.findById(id); // Retorna el recurso actualizado
  }

  // Eliminar un recurso (soft delete)
  async delete(id: number): Promise<void> {
    await this.recursosRepository.update(id, { estado: false }); // Marcado como eliminado
  }
}
