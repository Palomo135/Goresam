import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { IClausulaService } from "../interfaces/clausulaInterf.service";
import { ClausulaRepository } from "src/repository/clausula.repository";
import { Clausula } from "src/modelo/clausula.entity";
import { ClausulaUpdateDto } from "src/DTO/clausulaUpdate.DTO";
import { Recursos } from "src/modelo/recursos.entity";
import { RecursosRepository } from "src/repository/recursos.repository";
import { clausulaListDTO } from "src/DTO/clausulaElist.DTO";

@Injectable()
export class ClausulaService implements IClausulaService {
    private clausulas = [];
    constructor(
        private readonly clausulaRepository: ClausulaRepository,
        // @InjectRepository(Clausula)
        // private readonly clausulaRepository: Repository<Clausula>,        
    ) { }

    //obtener todas las clausulas
    async findAll(): Promise<Clausula[]> {
        return this.clausulaRepository.findAll();
    }

    //obtener una clausula por id
    async findById(id: number): Promise<Clausula> {
        return this.clausulaRepository.findById(id);
    }

    // async findByModulo(moduloId: number): Promise<clausulaListDTO[]> {
    //     return this.clausulaRepository.findByModulo(moduloId);
    // }

    async assignClausulasToModulo(moduloId: number, clausulas: number[]): Promise<void> {
        await this.clausulaRepository.assignClausulasToModulo(moduloId, clausulas);
    }

    async removeClausulaFromModulo(moduloId: number, clausulaId: number): Promise<void> {
        await this.clausulaRepository.removeClausulaFromModulo(moduloId, clausulaId);
    }

    //Crear una clausula
    // async create(clausula: Partial<Clausula>, recurso: Recursos): Promise<Clausula> {
    //     return this.clausulaRepository.create(clausula, recurso);
    // }
    async create(clausula: Partial<Clausula>, moduloId: number): Promise<Clausula> {
        return this.clausulaRepository.create(clausula, moduloId);
    }
    //actualizar una clausula
    // async update(id: number, clausula: Partial<Clausula>, recursoId: number): Promise<Clausula> {

    //     return this.clausulaRepository.update(id, clausula, recursoId);
    // }
    // async update(id: number, clausula: Partial<Clausula>): Promise<Clausula> {
    //     return this.clausulaRepository.update(id, clausula);
    // }

    async update(id: number, clausulaUpdateDto: ClausulaUpdateDto): Promise<Clausula> {
        const { moduloId, ...clausulaData } = clausulaUpdateDto;

        return this.clausulaRepository.update(id, clausulaData, moduloId);
    }

    //Eliminar una clausual
    async delete(id: number): Promise<void> {
        return this.clausulaRepository.delete(id);
    }

}