// encargado.controller.ts
import { Controller, Get, Post, Body } from '@nestjs/common';
import { EncargadoService } from 'src/service/implements/encargadoImple.service';
import { Encargado } from 'src/modelo/encargado.entity';

@Controller('encargado')
export class EncargadoController {
    constructor(private readonly encargadoService: EncargadoService) { }

    @Get()
    findAll(): Promise<Encargado[]> {
        return this.encargadoService.findAll();
    }

    @Post()
    create(@Body() encargado: Encargado): Promise<Encargado> {
        return this.encargadoService.create(encargado);
    }
}