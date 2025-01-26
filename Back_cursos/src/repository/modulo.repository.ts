import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Clausula } from "src/modelo/clausula.entity";
import { Curso } from "src/modelo/curso.entity";
import { Modulo } from "src/modelo/modulo.entity";
import { Repository } from "typeorm";

@Injectable()
export class ModuloRepository {

  constructor(
    @InjectRepository(Modulo) private readonly moduloRepository: Repository<Modulo>,
    //@InjectRepository(Clausula) private readonly clausulaRepository: Repository<Clausula>,
    @InjectRepository(Curso) private readonly cursoRepository: Repository<Curso>
  ) { }

  // obtener todos los modulos
  async findAll(): Promise<Modulo[]> {
    return this.moduloRepository.find({
      where: { estado: true },
      // relations: ['clausula']
      relations: ['curso', 'clausulas'],
    });
  }

  // Obtener módulos por curso
  async findByCurso(cursoId: number): Promise<Modulo[]> {
    return this.moduloRepository.find({
      where: { curso: { id: cursoId }, estado: true },
      relations: ['curso', 'clausulas'],
      order: { orden: 'ASC' }, // Ordenar por campo 'orden'
    });
  }
  //obtener modulo por id
  async findById(id: number): Promise<Modulo> {
    return this.moduloRepository.findOne({
      where: { id, estado: true },
      // relations: ['clausula']
      relations: ['curso', 'clausulas'],
    });
  }

  //crear un nuevo modulo

  async create(modulo: Partial<Modulo>, cursoId: number): Promise<Modulo> {
    const curso = await this.cursoRepository.findOne({ where: { id: cursoId, estado: true } });
    if (!curso) {
      throw new NotFoundException('El curso no fue encontrado o está inactivo.');
    }

    const newModulo = this.moduloRepository.create({ ...modulo, curso, fechaCreate: new Date() });
    return this.moduloRepository.save(newModulo);
  }

  //editar modulo

  // async update(id: number, modulo: Partial<Modulo>, cursoId: number): Promise<Modulo> {
  //     const curso = await this.cursoRepository.findOne({ where: { id: cursoId, estado: true } });
  //     if (!curso) {
  //       throw new NotFoundException('El curso no fue encontrado o está inactivo.');
  //     }

  //     await this.moduloRepository.update(id, { ...modulo, curso, fechaUpdate: new Date() });
  //     return this.findById(id);
  //   }
  // Actualizar un módulo
  async update(id: number, modulo: Partial<Modulo>, cursoId: number): Promise<Modulo> {
    const curso = await this.cursoRepository.findOne({ where: { id: cursoId, estado: true } });
    if (!curso) {
      throw new NotFoundException('El curso no fue encontrado o está inactivo.');
    }

    await this.moduloRepository.update(id, {
      ...modulo,
      curso,
      fechaUpdate: new Date(),
    });
    return this.findById(id);
  }
  //eliminar modulo    
  async delete(id: number): Promise<void> {
    await this.moduloRepository.update(id, { estado: false });
  }
}