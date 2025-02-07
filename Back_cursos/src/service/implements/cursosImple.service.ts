import { Injectable, NotFoundException, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CursoElistDTO } from "src/DTO/cursoElist.DTO";
import { Curso } from "src/modelo/curso.entity";
import { DetallePalabraClave } from "src/modelo/detallePalabraClave.entity";
import { Repository, DataSource } from "typeorm";
import { EncargadoService } from "./encargadoImple.service";
import { Encargado } from "src/modelo/encargado.entity";
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
    private readonly DetallePalabraClaveReposi: Repository<DetallePalabraClave>,
    private dataSource: DataSource,
    private readonly encargadoService: EncargadoService
  ) { }

  // findAll(): Promise<Curso[]> {
  //   return this.cursoRepository.find({ relations: ['detallePalabrasClave'] });
  // }

  async findAll(): Promise<Curso[]> {
    const cursos = await this.cursoRepository.find({
      relations: ['detallePalabrasClave', 'encargado'],
      order: { fechaCreate: 'DESC' }
    });
    return cursos
  }

  async findElistAll(): Promise<CursoElistDTO[]> {
    const cursos = await this.cursoRepository.find({
      relations: ['encargado'],
      select: ['id', 'nombre', 'logo', 'fechaCaducidad', 'fechaInicio', 'encargado'], // Seleccionamos solo los campos necesarios
      order: { fechaCreate: 'DESC' }
    });

    // Mapear a CursoElistDTO con URLs de logo
    return cursos.map((curso) => ({
      id: curso.id,
      nombre: curso.nombre,
      logo: curso.logo ? `http://localhost:3200/api/curso/logo/${curso.id}` : null,
      fechaInicio: curso.fechaInicio,
      fechaCaducidad: curso.fechaCaducidad,
      encargado: curso.encargado ? curso.encargado.nombre : null
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
      relations: ['encargado', 'detallePalabrasClave']
    });
    if (!curso) {
      throw new NotFoundException('Curso no encontrado');
    }
    console.log(curso);
    return curso;
  }

  async create(cursoDTO: CursoEditDTO): Promise<Curso> {
    console.log('curso del fornt', cursoDTO)
    const cursoData: Curso = new Curso();
    cursoData.nombre = cursoDTO.nombre;
    cursoData.descripcion = cursoDTO.descripcion;
    cursoData.fechaInicio = cursoDTO.fechaInicio;
    cursoData.fechaCaducidad = cursoDTO.fechaCaducidad;
    cursoData.recurso = cursoDTO.recurso;
    cursoData.frase = cursoDTO.frase;
    cursoData.aprendizaje = cursoDTO.aprendizaje;
    cursoData.dirigido = cursoDTO.dirigido;
    cursoData.requisitos = cursoDTO.requisitos;
    cursoData.reconocimiento = cursoDTO.reconocimiento;

    if (cursoDTO.estado == 'true') {
      cursoData.estado = true;
    }
    else {
      cursoData.estado = false;
    }

    if (cursoDTO.logo) {
      cursoData.logo = cursoDTO.logo;
    }
    if (cursoDTO.encargado) {
      console.log('numero del responsable', cursoDTO.encargado)
      const encargadoId = parseInt(cursoDTO.encargado);
      const responsable = await this.encargadoService.findOne(encargadoId)
      if (!responsable) {
        throw new NotFoundException('Encargado no encontrado');
      }
      cursoData.encargado = responsable;
    }

    const curso = this.cursoRepository.create(cursoData);
    await this.cursoRepository.save(curso);

    if (cursoDTO.detallePalabraClave && cursoDTO.detallePalabraClave.length > 0) {
      const keywords = typeof cursoDTO.detallePalabraClave === 'string'
        ? JSON.parse(cursoDTO.detallePalabraClave)
        : cursoDTO.detallePalabraClave;

      const detalles = keywords.map(dto => {
        const detalle = new DetallePalabraClave();
        detalle.nombre = dto.nombre;
        detalle.curso = curso;
        return detalle;
      });
      await this.DetallePalabraClaveReposi.save(detalles);
    }
    console.log('curso registrado: ', curso);
    return this.findOne(curso.id);
  }

  async update(id: number, updateDTO: CursoEditDTO): Promise<Curso> {
    // Buscar el curso por ID con relaciones necesarias
    const curso = await this.cursoRepository.findOne({
      where: { id },
      relations: ['detallePalabrasClave', 'encargado'],
    });

    if (!curso) {
      throw new NotFoundException('Curso no encontrado');
    }

    // Actualizar los campos proporcionados
    curso.nombre = updateDTO.nombre ?? curso.nombre;
    curso.descripcion = updateDTO.descripcion ?? curso.descripcion;
    curso.recurso = updateDTO.recurso ?? curso.recurso;
    curso.fechaInicio = updateDTO.fechaInicio ?? curso.fechaInicio;
    curso.fechaCaducidad = updateDTO.fechaCaducidad ?? curso.fechaCaducidad;

    if (updateDTO.estado == 'true') {
      curso.estado = true;
    }
    else {
      curso.estado = false;
    }

    if (updateDTO.encargado) {
      const encargadoId = parseInt(updateDTO.encargado);
      const encargado = await this.encargadoService.findOne(encargadoId)
      if (!encargado) {
        throw new NotFoundException('Encargado no encontrado')
      }
      curso.encargado = encargado ?? curso.encargado;
    }

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

    console.log('curso actualizado: ', curso)
    // Guardar los cambios
    await this.cursoRepository.save(curso);

    // Evitar circularidad al devolver el objeto
    return {
      ...curso,
      detallePalabrasClave: curso.detallePalabrasClave.map(k => ({ id: k.id, nombre: k.nombre })),
    } as Curso;
  }


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
