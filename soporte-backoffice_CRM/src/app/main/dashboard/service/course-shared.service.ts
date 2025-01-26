import { Injectable } from "@angular/core";
import { Curso } from "../etiquetera/curso";
import { BehaviorSubject } from "rxjs";
import { CursoEdit } from "../etiquetera/cursoEdit";

@Injectable({
  providedIn: 'root',
})
export class CourseSharedService {
  // BehaviorSubject para almacenar el curso a editar
  private courseSource = new BehaviorSubject<CursoEdit | null>(null);
  course$ = this.courseSource.asObservable();

  // Método para actualizar el curso
  setCourse(course: CursoEdit): void {
    console.log("Curso seleccionado para editar:", course);

    this.courseSource.next(course);
  }

  getCourse() {
    return this.courseSource.asObservable();
  }

  // Método para limpiar el curso
  clearCourse(): void {
    this.courseSource.next(null);
  }
}