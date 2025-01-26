import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import { Clausula } from "src/modelo/clausula.entity";
import { Modulo } from "src/modelo/modulo.entity";
import { CreateModuloDTO } from "src/DTO/modulo.DTO";
import { ModuloImpleService } from "src/service/implements/moduloImple.service";
import { ModuloListDTO } from "src/DTO/moduloList.DTO";

@Controller('modulo')
export class ModuloController {
  constructor(private readonly moduloService: ModuloImpleService) { }

  @Get('todos')
  findAllModulos(): Promise<Modulo[]> {
    return this.moduloService.findAllModulos()
  }

  @Get()
  findElistAll(): Promise<ModuloListDTO[]> {
    return this.moduloService.findElistAll();
  }

  @Get()
  findAll(@Query('cursoId') cursoId: number): Promise<Modulo[]> {
    return this.moduloService.findAll(cursoId);
  }

  @Post()
  create(@Body() modulo: CreateModuloDTO): Promise<Modulo> {
    if (modulo.estado === undefined) {
      modulo.estado = true;  // O cualquier valor por defecto que quieras asignar
    }
    return this.moduloService.create(modulo);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() modulo: Modulo): Promise<Modulo> {
    return this.moduloService.update(id, modulo);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.moduloService.remove(id);
  }
}