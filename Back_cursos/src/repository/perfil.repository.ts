import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Perfil } from "src/modelo/perfil.entity";
import { Repository } from "typeorm";

@Injectable()
export class PerfilRepository{
    
    constructor(
            // Inyección del repositorio de TypeORM para la entidad Perfil
        @InjectRepository(Perfil)
        private perfilRepository : Repository<Perfil>,
    ){}

    //Método para obtener todos los perfiles
    async findAll(): Promise<Perfil[]>{
        return this.perfilRepository.query('SELECT * FROM perfil WHERE estado = true');
    }

    //Método para obtener un perfil por ID
    async findById(id: number): Promise<Perfil>{
        const result = await this.perfilRepository.query('SELECT * FROM perfil WHERE id = $1', [id])
        return result[0];
    }

    //Método para crear un nuevo perfil
    async create(perfil: Perfil): Promise<Perfil>{
        const result = await this.perfilRepository.query(
            'INSERT INTO perfil(rol, descripcion) VALUES ($1, $2) RETURNING *',
            [perfil.rol, perfil.descripcion]
        );
        return result[0];
    }

    //Método para actualizar un perfil existente
    async update(id: number, perfil: Perfil): Promise<Perfil>{
        const result = await this.perfilRepository.query(
            'UPDATE perfil SET rol = $1, descripcion = $2, WHERE id = $4 RETURNING *',
            [perfil.rol, perfil.descripcion, id],
        );
        return result[0];
    }

    //Método para eliminar un perfil por ID
    async delete(id: number): Promise<void>{
        await this.perfilRepository.query('UPDATE perfil SET estado = false WHERE id = $1', [id]);
    }

    //usando TypeORM
     // Método para obtener todos los perfiles con estado = true
    //  async findAll(): Promise<Perfil[]> {
    //     return await this.perfilRepository.find({
    //         where: { estado: true },
    //     });
    // }

    // // Método para obtener un perfil por ID
    // async findById(id: number): Promise<Perfil | null> {
    //     return await this.perfilRepository.findOne({
    //         where: { id, estado: true },
    //     });
    // }

    // // Método para crear un nuevo perfil
    // async create(perfil: Perfil): Promise<Perfil> {
    //     const nuevoPerfil = this.perfilRepository.create(perfil);
    //     return await this.perfilRepository.save(nuevoPerfil);
    // }

    // // Método para actualizar un perfil existente
    // async update(id: number, perfil: Partial<Perfil>): Promise<Perfil | null> {
    //     await this.perfilRepository.update(id, perfil);
    //     return this.findById(id); // Retornar el perfil actualizado
    // }

    // // Método para eliminar un perfil (cambia estado a false)
    // async delete(id: number): Promise<void> {
    //     await this.perfilRepository.update(id, { estado: false });
    // }
}