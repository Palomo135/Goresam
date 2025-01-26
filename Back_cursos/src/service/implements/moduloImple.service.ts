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
    return this.moduloRepository.find({ where: { curso: { id: cursoId } }, order: { orden: 'ASC' } });
  }

  findAllModulos(): Promise<Modulo[]> {
    return this.moduloRepository.find({ relations: ['curso'], order: { orden: 'ASC' } })
  }

  async findElistAll(): Promise<ModuloListDTO[]> {
    const modulos = await this.moduloRepository.find({
      select: {
        id: true,
        nombre: true,
        estado: true,
        orden: true,
        curso: {
          id: true
        }
      }, // Seleccionamos solo los campos necesarios
      relations: ['curso'],
      order: { fechaCreate: 'DESC' }
    });

    console.log(modulos)
    // Mapear a CursoElistDTO con URLs de logo
    return modulos
  }

  // create(modulo: Modulo): Promise<Modulo> {
  //   return this.moduloRepository.save(modulo);
  // }

  async create(moduloDto: CreateModuloDTO): Promise<Modulo> {
    const { cursoId, ...moduloData } = moduloDto;

    // Buscar el curso relacionado
    const curso = await this.cursoRepository.findOne({ where: { id: cursoId } });
    if (!curso) {
      throw new NotFoundException(`Curso con ID ${cursoId} no encontrado`);
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
    await this.moduloRepository.update(id, modulo);
    return this.moduloRepository.findOne({ where: { id } }); // Asegúrate de pasar el ID directamente
  }

  async remove(id: number): Promise<void> {
    await this.moduloRepository.delete(id);
  }
}