import { Injectable } from "@nestjs/common";
import { RecursosRepository } from "src/repository/recursos.repository";
import { Recursos } from "src/modelo/recursos.entity";
import { RecursosDTO } from "src/dto/recursos.dto";
import { IRecursosService } from "../interfaces/recursosInterf.service";

@Injectable()
export class RecursosService implements IRecursosService{
  constructor(private readonly recursosRepository: RecursosRepository) {}

  // Obtener todos los recursos
  async findAll(): Promise<Recursos[]> {
    return this.recursosRepository.findAll();
  }

  // Obtener un recurso por ID
  async findById(id: number): Promise<Recursos> {
    return this.recursosRepository.findById(id);
  }

  // Crear un nuevo recurso
  async create(recurso: Partial<Recursos>): Promise<Recursos> {
    return this.recursosRepository.create(recurso);
  }

  // Actualizar un recurso existente
  async update(id: number, recurso: Partial<Recursos>): Promise<RecursosDTO> {
    const updatedRecurso = await this.recursosRepository.update(id, recurso);

    // Transformar a DTO
    const recursoDTO: RecursosDTO = {
      url: updatedRecurso.url,
      fuente: updatedRecurso.fuente,
      tamanio: updatedRecurso.tamanio,
      extension: updatedRecurso.extension,
      tipo: updatedRecurso.tipo,
      estado: updatedRecurso.estado,
      nombre: updatedRecurso.nombre,
    };

    return recursoDTO;
  }

  // Eliminar un recurso
  async delete(id: number): Promise<void> {
    await this.recursosRepository.delete(id);
  }
}
