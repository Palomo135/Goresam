import { Etiqueta } from 'src/modelo/etiqueta.entity';
import { EtiquetaService } from './../service/implements/etiquetaImple.service';
import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";

@Controller('etiqueta')
export class EtiquetaController{

    constructor(private readonly etiquetaService: EtiquetaService){}

    // crear etiqueta
    @Post()
    async create(@Body() etiqueta: Etiqueta): Promise<Etiqueta> {
        return this.etiquetaService.create(etiqueta);
    }

    //obtener todas las etiquetas
    @Get()
    async findAll(): Promise<Etiqueta[]> {
        return this.etiquetaService.findAll();
    }

    //obtener etiqueta por id
    @Get(':id')
    async findById(@Param('id')id: number): Promise<Etiqueta>{
        return this.etiquetaService.findById(id);
    }

    //actualizar etiqueta
    @Put(':id')
    async update(@Param('id')id: number, @Body() etiqueta: Etiqueta): Promise<Etiqueta> {
        return this.etiquetaService.update(id, etiqueta);
    }

    //eliminar etiqueta
    @Delete(':id')
    async delete(@Param('id')id: number): Promise<void> {
        return this.etiquetaService.delete(id);
    }

}