import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Encargado } from './encargado';

@Injectable({
    providedIn: 'root'
})
export class EncargadoService {
    private baseUrl = 'http://localhost:3000/encargado';

    constructor(private http: HttpClient) { }

    getEncargados(): Observable<Encargado[]> {
        return this.http.get<Encargado[]>(this.baseUrl);
    }

    createEncargado(encargado: Encargado): Observable<Encargado> {
        return this.http.post<Encargado>(this.baseUrl, encargado);
    }
}