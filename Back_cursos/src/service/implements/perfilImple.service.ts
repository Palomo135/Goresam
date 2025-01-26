import { PerfilRepository } from './../../repository/perfil.repository';
import { Injectable } from "@nestjs/common";
import { IPerfilService } from "../interfaces/perfilInterf.service";
import { Perfil } from 'src/modelo/perfil.entity';

@Injectable()
export class PerfilService implements IPerfilService{

    constructor(private perfilRepository: PerfilRepository){}

    //Método para crear un nuevo perfil
    async create(perfil: Perfil): Promise<Perfil> {
        return this.perfilRepository.create(perfil); // llama al método del repositorio para crear el perfil
    }

    //Método para obtener todos los perfiles
    async findAll(): Promise<Perfil[]> {
        return this.perfilRepository.findAll();
    }

    //Método para obtener un perfil por ID
    async finById(id: number): Promise<Perfil> {
        return this.perfilRepository.findById(id);
    }

    //Método para actualizar un perfil existente
    async update(id: number, perfil: Perfil): Promise<Perfil>{
        return this.perfilRepository.update(id, perfil);
    }

    //Método para eliminar un perfil por ID
    async delete(id: number): Promise<void> {
        return this.perfilRepository.delete(id);
    }
}