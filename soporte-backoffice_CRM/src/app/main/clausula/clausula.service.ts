import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Clausula } from "./r-clausula/clausula";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class ClausulaService {

  private apiUrl = 'http://localhost:3200/api/clausula';

  constructor(private http: HttpClient) { }

  getClausulas(): Observable<Clausula[]> {
    return this.http.get<Clausula[]>(this.apiUrl);
  }

  createClausula(clausula: Clausula): Observable<Clausula> {
    return this.http.post<Clausula>(this.apiUrl, clausula);
  }

  updateClausula(id: number, clausula: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, clausula);
  }

  deleteClausula(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}