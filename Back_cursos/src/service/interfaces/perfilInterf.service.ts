import { Perfil } from "src/modelo/perfil.entity";

export interface IPerfilService{
    create(perfil: Perfil): Promise<Perfil>;                 //crear un nuevo perfil
    findAll(): Promise<Perfil[]>;                            //Obtener todos los perfiles
    finById(id: number): Promise<Perfil>;                    //Obtener un perfil por ID
    update(id: number, perfil: Perfil): Promise<Perfil>;     //Actualizar un perfil
    delete(id: number): Promise<void>;                        //Eliminar un perfil
}