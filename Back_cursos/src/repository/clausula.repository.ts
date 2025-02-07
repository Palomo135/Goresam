import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Clausula } from "src/modelo/clausula.entity";
import { Modulo } from "src/modelo/modulo.entity";
import { Recursos } from "src/modelo/recursos.entity";
import { Repository } from "typeorm";

@Injectable()
export class ClausulaRepository {

  constructor(
    @InjectRepository(Clausula) private readonly clausulaRepository: Repository<Clausula>,
    @InjectRepository(Modulo) private readonly moduloRepository: Repository<Modulo>,

  ) { }

  //obtener todas las clausulas con sus recursos
  async findAll(): Promise<Clausula[]> {
    return this.clausulaRepository.find({
      where: { estado: true },
      relations: ['modulo']
    });
  }

  // Obtener una cláusula por su ID con sus recursos
  async findById(id: number): Promise<Clausula> {
    return this.clausulaRepository.findOne({
      where: { id, estado: true },
      // relations: ['recurso'], // Incluye la relación con recursos
    });
  }

  //crear una nueva clausula
  // async create(clausula: Partial<Clausula>): Promise<Clausula> {
  //   const newClausula = this.clausulaRepository.create({ ...clausula, fechaCreate: new Date() });
  //   return this.clausulaRepository.save(newClausula);
  // }

  async create(clausula: Partial<Clausula>, moduloId: number): Promise<Clausula> {
    const modulo = await this.moduloRepository.findOne({ where: { id: moduloId, estado: true } });
    if (!modulo) {
      throw new NotFoundException('Modulo no encontrado');
    }
    const newClausula = this.clausulaRepository.create({ ...clausula, fechaCreate: new Date() });
    return this.clausulaRepository.save(newClausula);
  }

  //actualizar una clausula

  // async update(id: number, clausula: Partial<Clausula>, recursoId: number): Promise<Clausula> {
  //     // Buscar el recurso por su ID
  //     const recurso = await this.recursosRepository.findOne({
  //       where: { id: recursoId, estado: true },
  //     });

  //     if (!recurso) {
  //       throw new Error('Recurso no encontrado o está inactivo');
  //     }

  //     // Actualizar la cláusula asignando el recurso encontrado
  //     await this.clausulaRepository.update(id, {
  //       ...clausula,
  //       recurso,
  //       fechaUpdate: new Date(),
  //     });

  //     // Retornar la cláusula actualizada
  //     return this.findById(id);
  //   }

  // async update(id: number, clausula: Partial<Clausula>): Promise<Clausula> {
  //   await this.clausulaRepository.update(id, { ...clausula, fechaUpdate: new Date() });
  //   return this.findById(id);
  // }

  async update(id: number, clausula: Partial<Clausula>, moduloId?: number): Promise<Clausula> {
    const clausulaToUpdate = await this.clausulaRepository.findOne({ where: { id } });

    if (!clausulaToUpdate) {
      throw new NotFoundException(`Cláusula con ID ${id} no encontrada`);
    }


    await this.clausulaRepository.save({ ...clausulaToUpdate, ...clausula, fechaUpdate: new Date() });
    return this.findById(id);
  }

  //eliminar clausula
  async delete(id: number): Promise<void> {
    await this.clausulaRepository.update(id, { estado: false });
  }

  // Asignar cláusulas a un módulo
  async assignClausulasToModulo(moduloId: number, clausulas: number[]): Promise<void> {
    const modulo = await this.moduloRepository.findOne({ where: { id: moduloId, estado: true }, relations: ['clausulas'] });
    if (!modulo) {
      throw new NotFoundException('Modulo no encontrado');
    }

    const clausulasEntities = await this.clausulaRepository.findByIds(clausulas);
    await this.moduloRepository.save(modulo);
  }


  async removeClausulaFromModulo(moduloId: number, clausulaId: number): Promise<void> {
    const modulo = await this.moduloRepository.findOne({ where: { id: moduloId }, relations: ['clausulas'] });
    if (!modulo) {
      throw new NotFoundException('Modulo no encontrado');
    }


    await this.moduloRepository.save(modulo);
  }

}