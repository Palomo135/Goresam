import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { ClausulaUpdateDto } from "src/DTO/clausulaUpdate.DTO";
import { Clausula } from "src/modelo/clausula.entity";
import { ClausulaService } from "src/service/implements/clausulaImple.service";

@Controller('clausula')
export class ClausulaController {
  constructor(
    private readonly clausulaService: ClausulaService
  ) { }

  //obtener todas las clausulas
  @Get()
  async findAll(): Promise<Clausula[]> {
    return this.clausulaService.findAll();
  }

  //obtenr una clausula por id
  @Get(':id')
  async findById(@Param('id') id: number): Promise<Clausula> {
    return this.clausulaService.findById(id);
  }

  @Post()
  async create(@Body() clausula: Partial<Clausula>, @Body('moduloId') moduloId: number): Promise<Clausula> {
    if (!moduloId) {
      throw new BadRequestException('Se debe proporcionar un modulo para crear la clausula');
    }
    return this.clausulaService.create(clausula, moduloId);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() clausulaUpdate: ClausulaUpdateDto) {
    return this.clausulaService.update(+id, clausulaUpdate);
  }

  //Eliminar una Clausula
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.clausulaService.delete(+id);
  }
}