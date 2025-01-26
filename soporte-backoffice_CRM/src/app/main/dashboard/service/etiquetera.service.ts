import { DetallePalabraClave } from '../etiquetera/detallePalabraClave';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Curso } from '../etiquetera/curso';
import { CursoElistDTO } from '../etiquetera/cursosElist';
import { CursoEdit } from '../etiquetera/cursoEdit';

@Injectable({
  providedIn: 'root'
})
export class EtiqueteraService {

  private apiUrl: string = "http://localhost:3200/api/curso";

  constructor(private http: HttpClient) { }

  // getCourses(): Observable<Curso[]> {
  //   return this.http.get<Curso[]>(this.apiUrl);
  // }

  // Método para obtener un curso por ID
  getCursoById(id: number): Observable<CursoEdit> {
    return this.http.get<CursoEdit>(`${this.apiUrl}/${id}`);
  }

  getCoursesElist(): Observable<CursoElistDTO[]> {
    return this.http.get<CursoElistDTO[]>(this.apiUrl);
  }

  getCourses(): Observable<Curso[]> {
    return this.http.get<Curso[]>(this.apiUrl);
  }

  createCourse(formData: FormData): Observable<Curso> {
    return this.http.post<Curso>(this.apiUrl, formData);
  }

  updateCourse(id: number, formData: FormData): Observable<Curso> {
    return this.http.put<Curso>(`${this.apiUrl}/${id}`, formData);
  }

  deleteCourse(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // EtiqueteraService
  getDetallePalabraClave(cursoId: number): Observable<DetallePalabraClave[]> {
    // También corregir esta URL para que use apiUrl
    return this.http.get<DetallePalabraClave[]>(`${this.apiUrl}/${cursoId}/detallePalabraClave`);
  }

}
