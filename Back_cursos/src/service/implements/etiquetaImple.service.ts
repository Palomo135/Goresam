import { Injectable } from "@nestjs/common";
import { IEtiquetaServide } from "../interfaces/etiquetaInterf.service";
import { EtiquetaRepository } from "src/repository/etiqueta.repository";
import { Etiqueta } from "src/modelo/etiqueta.entity";

@Injectable()
export class EtiquetaService implements IEtiquetaServide{
constructor(private readonly etiquetaRepository: EtiquetaRepository) {}

//obtener todos las etiwuetas
async findAll(): Promise<Etiqueta[]>{
    return this.etiquetaRepository.findAll();
}

//obtenner una etiqueta por su id
async findById(id: number): Promise<Etiqueta> {
    return this.etiquetaRepository.findById(id);
}

//crear etiqueta
async create(etiqueta: Etiqueta): Promise<Etiqueta> {
    return this.etiquetaRepository.create(etiqueta);
}

//editar etiqueta
async update(id: number, etiqueta: Etiqueta): Promise<Etiqueta> {
    return this.etiquetaRepository.update(id, etiqueta);
}

//eliminar etiqueta
async delete(id: number): Promise<void>{
    await this.etiquetaRepository.delete(id);
}
}