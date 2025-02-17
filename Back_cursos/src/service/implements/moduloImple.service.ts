import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Modulo } from 'src/modelo/modulo.entity';
import { CreateModuloDTO } from 'src/DTO/modulo.DTO';
import { Curso } from 'src/modelo/curso.entity';
import { ModuloListDTO } from 'src/DTO/moduloList.DTO';

@Injectable()
export class ModuloImpleService {
  constructor(
    @InjectRepository(Modulo)
    private readonly moduloRepository: Repository<Modulo>,
    @InjectRepository(Curso)
    private readonly cursoRepository: Repository<Curso>,
  ) { }

  findAll(cursoId: number): Promise<Modulo[]> {
    return this.moduloRepository.find({ where: { curso: { id: cursoId } }, relations: ['curso'], order: { orden: 'ASC' } });
  }

  async getModulo(moduloId: number): Promise<Modulo> {
    const modulo = await this.moduloRepository.findOne({ where: { id: moduloId } });
    if (!modulo) {
      throw new NotFoundException(`Modulo with ID ${moduloId} not found`);
    }
    return modulo;
  }

  findAllModulos(): Promise<Modulo[]> {
    return this.moduloRepository.find({ relations: ['curso'], order: { orden: 'ASC' } })
  }

  async findElistAll(): Promise<ModuloListDTO[]> {
    const modulos = await this.moduloRepository.find({
      select: {
        id: true,
        nombre: true,
        descripcion: true,
        estado: true,
        orden: true,
        curso: {
          id: true
        }
      }, // Seleccionamos solo los campos necesarios
      relations: ['curso'],
      order: { fechaCreate: 'DESC' }
    });
    return modulos
  }

  async findModulosByCurso(cursoId: number): Promise<Modulo[]> {
    return this.moduloRepository.find({
      where: { curso: { id: cursoId }, estado: true },
      relations: ['curso'],
      order: { orden: 'ASC' },
    });
  }

  async create(moduloDto: CreateModuloDTO): Promise<Modulo> {
    const { cursoId, ...moduloData } = moduloDto;

    let curso: Curso | undefined;
    if (cursoId) {
      curso = await this.cursoRepository.findOne({ where: { id: cursoId } });
      // Buscar el curso relacionado
      if (!curso) {
        throw new NotFoundException(`Curso con ID ${cursoId} no encontrado`);
      }
    }

    // Crear el módulo y asignar el curso
    const modulo = this.moduloRepository.create({
      ...moduloData,
      curso, // Asignar la relación
    });

    // Guardar el módulo
    return this.moduloRepository.save(modulo);
  }

  async update(id: number, modulo: Modulo): Promise<Modulo> {
    const updatedModulo = await this.moduloRepository.findOne({ where: { id: id } });

    updatedModulo.nombre = modulo.nombre;
    updatedModulo.descripcion = modulo.descripcion;
    updatedModulo.orden = modulo.orden;
    updatedModulo.estado = modulo.estado;
    updatedModulo.curso = modulo.curso;
    return this.moduloRepository.save(updatedModulo);
  }

  async assignModuleToCurso(cursoId: number, moduloId: number): Promise<void> {
    const curso = await this.cursoRepository.findOne({ where: { id: cursoId }, relations: ['modulos'] });
    if (!curso) {
      throw new NotFoundException('Curso no encontrado');
    }

    const modulo = await this.moduloRepository.findOne({ where: { id: moduloId } });
    if (!modulo) {
      throw new NotFoundException('Módulo no encontrado');
    }

    curso.modulos.push(modulo);
    await this.cursoRepository.save(curso);
  }

  async removeModuleFromCurso(cursoId: number, moduloId: number): Promise<void> {
    const curso = await this.cursoRepository.findOne({ where: { id: cursoId }, relations: ['modulos'] });
    if (!curso) {
      throw new NotFoundException('Curso no encontrado');
    }

    curso.modulos = curso.modulos.filter(modulo => modulo.id !== moduloId);
    await this.cursoRepository.save(curso);
  }

  async remove(id: number): Promise<void> {
    await this.moduloRepository.delete(id);
  }
}