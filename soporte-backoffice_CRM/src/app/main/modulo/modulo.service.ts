import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Modulo } from './R_modulo/modulo';
import { ModuloList } from './R_modulo/moduloList';

@Injectable({
  providedIn: 'root'
})
export class ModuloService {
  private apiUrl: string = 'http://localhost:3200/api/modulo';

  constructor(private http: HttpClient) { }

  getModulos(cursoId: number): Observable<Modulo[]> {
    return this.http.get<Modulo[]>(`${this.apiUrl}?cursoId=${cursoId}`);
  }

  getModulosSinCurso(): Observable<Modulo[]> {
    // Endpoint para obtener módulos sin curso asignado
    return this.http.get<Modulo[]>(`${this.apiUrl}/sin-curso`);
  }

  getTodosModulos(): Observable<Modulo[]> {
    return this.http.get<Modulo[]>(`${this.apiUrl}/todos`);
  }

  assignModuleToCurso(cursoId: number, moduloId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/assign`, { cursoId, moduloId });
  }

  removeModuleFromCurso(cursoId: number, moduloId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/remove`, { body: { cursoId, moduloId } });
  }

  getModulosLista(): Observable<ModuloList[]> {
    return this.http.get<ModuloList[]>(`${this.apiUrl}`);
  }

  createModulo(modulo: Modulo): Observable<Modulo> {
    return this.http.post<Modulo>(this.apiUrl, modulo);
  }

  updateModulo(modulo: Modulo): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${modulo.id}`, modulo);
  }

  deleteModulo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}