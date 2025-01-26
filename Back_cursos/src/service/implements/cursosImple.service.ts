import { Injectable, NotFoundException, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CursoElistDTO } from "src/DTO/cursoElist.DTO";
import { Curso } from "src/modelo/curso.entity";
import { DetallePalabraClave } from "src/modelo/detallePalabraClave.entity";
import { Repository, DataSource } from "typeorm";
import { CursoEditDTO } from "src/DTO/cursoEdit.DTO";
import { MulterModule } from "@nestjs/platform-express";
import { Response } from "express";
import { CursoDTO } from "src/DTO/curso.DTO";


@Injectable()
export class CursoService {
  constructor(
    @InjectRepository(Curso)
    private readonly cursoRepository: Repository<Curso>,
    @InjectRepository(DetallePalabraClave)
    private readonly detallePalabraClaveRepository: Repository<DetallePalabraClave>,
    private dataSource: DataSource
  ) { }

  // findAll(): Promise<Curso[]> {
  //   return this.cursoRepository.find({ relations: ['detallePalabrasClave'] });
  // }

  async findAll(): Promise<Curso[]> {
    const cursos = await this.cursoRepository.find({
      relations: ['detallePalabrasClave'],
      order: {
        fechaCreate: 'DESC'
      }
    });
    return cursos
  }

  async findElistAll(): Promise<CursoElistDTO[]> {
    const cursos = await this.cursoRepository.find({
      select: ['id', 'nombre', 'logo'], // Seleccionamos solo los campos necesarios
      order: { fechaCreate: 'DESC' }
    });

    // Mapear a CursoElistDTO con URLs de logo
    return cursos.map((curso) => ({
      id: curso.id,
      nombre: curso.nombre,
      logo: curso.logo ? `http://localhost:3200/api/curso/logo/${curso.id}` : null,
    }));
  }

  async getLogo(id: number): Promise<any> {
    const curso = this.cursoRepository.findOne({
      select: ['logo'],
      where: { id }
    });
    if (!curso) {
      throw new NotFoundException('Logo no encontrado');
    }
    return curso;
  }

  // async getLogo(id: number): Promise<Buffer | null> {
  //   const curso = await this.cursoRepository.findOne({
  //     where: { id },
  //     select: ['logo'], // Solo selecciona el campo logo
  //   });
  //   return curso?.logo || null;
  // }

  async findOne(id: number): Promise<any> {
    //return this.cursoRepository.findOne({ where: { id } });
    const curso = await this.cursoRepository.findOne({
      where: { id },
      relations: ['detallePalabrasClave']
    });
    if (!curso) {
      throw new NotFoundException('Curso no encontrado');
    }
    return curso;
  }

  async create(curso: Curso): Promise<Curso> {
    return await this.cursoRepository.save(curso)
  }

  // async create(curso: Curso): Promise<Curso> {
  //   const queryRunner = this.dataSource.createQueryRunner();
  //   await queryRunner.connect();
  //   await queryRunner.startTransaction();

  //   try {


  //     // Guardar el curso
  //     const savedCurso = await queryRunner.manager.save(Curso, curso);
  //     await queryRunner.commitTransaction();

  //     // Retornar el curso con sus relaciones
  //     return this.findOne(savedCurso.id);

  //   } catch (error) {
  //     await queryRunner.rollbackTransaction();
  //     throw new InternalServerErrorException('Error al crear el curso');
  //   } finally {
  //     await queryRunner.release();
  //   }
  // }

  async update(id: number, updateDTO: CursoDTO): Promise<Curso> {
    console.log('Service recibe:', updateDTO);

    // Buscar el curso por ID con relaciones necesarias
    const curso = await this.cursoRepository.findOne({
      where: { id },
      relations: ['detallePalabrasClave'],
    });

    if (!curso) {
      throw new NotFoundException('Curso no encontrado');
    }

    // Actualizar los campos proporcionados
    curso.nombre = updateDTO.nombre ?? curso.nombre;
    curso.descripcion = updateDTO.descripcion ?? curso.descripcion;
    curso.recurso = updateDTO.recurso ?? curso.recurso;
    curso.estado = updateDTO.estado ?? curso.estado;

    if (updateDTO.logo) {
      curso.logo = updateDTO.logo;
    }

    // Procesar detallePalabraClave
    if (updateDTO.detallePalabraClave) {
      const keywords = typeof updateDTO.detallePalabraClave === 'string'
        ? JSON.parse(updateDTO.detallePalabraClave)
        : updateDTO.detallePalabraClave;

      curso.detallePalabrasClave = keywords.map(dto => {
        const detalle = new DetallePalabraClave();
        detalle.nombre = dto.nombre;
        detalle.curso = curso;
        return detalle;
      });
    }

    // Guardar los cambios
    await this.cursoRepository.save(curso);

    // Evitar circularidad al devolver el objeto
    return {
      ...curso,
      detallePalabrasClave: curso.detallePalabrasClave.map(k => ({ id: k.id, nombre: k.nombre })),
    } as Curso;
  }

  // async update(id: number, curso: CursoDTO): Promise<Curso> {
  //   const queryRunner = this.dataSource.createQueryRunner();
  //   await queryRunner.connect();
  //   await queryRunner.startTransaction();
  //   try {
  //     const existingCurso = await this.findOne(id);

  //     // Actualizar datos básicos del curso
  //     await queryRunner.manager.update(Curso, id, {
  //       ...curso,
  //       logo: curso.logo ?? existingCurso.logo,
  //       detallePalabrasClave: undefined, // No actualizar directamente las relaciones aquí
  //     });

  //     // Actualizar palabras clave
  //     if (curso.detallePalabraClave.length > 0) {
  //       await queryRunner.manager.delete(DetallePalabraClave, { curso: { id } });

  //       const palabrasClaveToSave = curso.detallePalabraClave.map((palabraClave) => {
  //         const detalle = new DetallePalabraClave();
  //         detalle.nombre = palabraClave.nombre;
  //         detalle.curso = { id } as Curso;
  //         return detalle;
  //       });

  //       await queryRunner.manager.save(DetallePalabraClave, palabrasClaveToSave);
  //     }

  //     await queryRunner.commitTransaction();

  //     //return this.findOne(id);

  //     // Obtener el curso actualizado con las relaciones
  //     const updatedCurso = await this.cursoRepository.findOne({
  //       where: { id },
  //       relations: ['detallePalabrasClave'],
  //     });
  //     return updatedCurso;

  //   } catch (error) {
  //     console.error('Error durante la actualización del curso:', error);
  //     await queryRunner.rollbackTransaction();
  //     if (error instanceof NotFoundException) throw error;
  //     throw new InternalServerErrorException('Error al actualizar el curso.');
  //   } finally {
  //     await queryRunner.release();
  //   }
  // }

  async remove(id: number): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Verificar si el curso existe
      const curso = await this.findOne(id);

      // Eliminar palabras clave primero
      await queryRunner.manager.delete(DetallePalabraClave, { curso: { id } });

      // Eliminar el curso
      await queryRunner.manager.delete(Curso, id);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error al eliminar el curso');
    } finally {
      await queryRunner.release();
    }
  }
}
