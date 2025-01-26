import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { Perfil } from "src/modelo/perfil.entity";
import { PerfilService } from "src/service/implements/perfilImple.service";

@Controller('perfil')
export class PerfilController{
    constructor(private perfilService: PerfilService){}

    //Enpoint para crear un nuevo perfil
    @Post()
    async create(@Body() perfil: Perfil): Promise<Perfil>{
        return this.perfilService.create(perfil); //llama al servicio para crear el perfil
    }

    //Endpoint para obtener todos los perfiles
    @Get()
    async findAll(): Promise<Perfil[]>{
        return this.perfilService.findAll();
    }

    //Endpoint para obtener un perfil por ID
    @Get(':id')
    async findById(@Param('id') id: number): Promise<Perfil>{
        return this.perfilService.finById(id);
    }

    //Endpoint para actualizar un perfil existente
    @Put(':id')
    async update(@Param('id') id: number, @Body() perfil: Perfil): Promise<Perfil>{
        return this.perfilService.update(id, perfil);
    }

    //Endpoint para eliminar un perfil
    @Delete(':id')
    async delete(@Param('id') id: number): Promise<void>{
        return this.perfilService.delete(id);
    }
}