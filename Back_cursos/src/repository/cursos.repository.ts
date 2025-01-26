import { CursoEditDTO } from "src/DTO/cursoEdit.DTO";
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Observable } from "rxjs";
import { Curso } from "src/modelo/curso.entity";
import { Recursos } from "src/modelo/recursos.entity";
import { Repository } from "typeorm";

@Injectable({})
export class CursosRepository {

  private apiUrl = 'http://localhost:3200/cuso';

  constructor(
    //private http: HttpClient,
    @InjectRepository(Curso) private readonly cursoRepository: Repository<Curso>,
    // @InjectRepository(Recursos) private readonly recursosRepository: Repository<Recursos>
  ) { }

  //relacionado con 
  async findByIdWithRelations(id: number): Promise<Curso> {
    return this.cursoRepository.findOne({
      where: { id, estado: true },
    });
  }

  // Obtener todos los cursos
  async findAll(): Promise<Curso[]> {
    return this.cursoRepository.find({
      where: { estado: true },
    });
  }

  //createCourse(course: FormData): Observable<Curso> {
  //return this.http.post<Curso>(this.apiUrl, course);
  //}
  // Obtener un curso por ID
  // async findById(id: number): Promise<Curso> {
  //   const curso = await this.cursoRepository.findOne({
  //     where: { id, estado: true }});

  //   if (!curso) {
  //     throw new NotFoundException(`Curso con ID ${id} no encontrado.`);
  //   }

  //   return curso;
  // }
  async findById(id: number): Promise<Curso> {
    const curso = await this.cursoRepository.findOne({ where: { id, estado: true }, relations: ['modulos'] });
    if (!curso) {
      throw new NotFoundException(`El curso con ID ${id} no existe.`);
    }
    return curso;
  }

  // Crear un nuevo curso
  async create(curso: Partial<Curso>): Promise<Curso> {
    const newCurso = this.cursoRepository.create({
      ...curso,
      fechaCreate: new Date()
    });
    return this.cursoRepository.save(newCurso);
  }

  // Actualizar un curso
  async update(
    id: number,
    cursoData: Partial<CursoEditDTO>
  ): Promise<Curso> {
    const curso = await this.findById(id);

    Object.assign(curso, cursoData, { fechaUpdate: new Date() });
    return this.cursoRepository.save(curso);
  }

  // Eliminar un curso
  async delete(id: number): Promise<void> {
    const curso = await this.findById(id);
    curso.estado = false;
    await this.cursoRepository.save(curso);
  }
}