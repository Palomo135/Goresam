import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, ParseIntPipe } from "@nestjs/common";
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

  @Get('modulo/:moduloId')
  findByModulo(@Param('moduloId', ParseIntPipe) moduloId: number): Promise<Clausula[]> {
    return this.clausulaService.findByModulo(moduloId);
  }

  @Post()
  async create(@Body() clausula: Partial<Clausula>, @Body('moduloId') moduloId: number): Promise<Clausula> {
    if (!moduloId) {
      throw new BadRequestException('Se debe proporcionar un modulo para crear la clausula');
    }
    return this.clausulaService.create(clausula, moduloId);
  }

  @Post('modulo/:moduloId')
  assignClausulasToModulo(@Param('moduloId', ParseIntPipe) moduloId: number, @Body() clausulas: number[]): Promise<void> {
    return this.clausulaService.assignClausulasToModulo(moduloId, clausulas);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() clausulaUpdate: ClausulaUpdateDto) {
    return this.clausulaService.update(+id, clausulaUpdate);
  }

  @Delete(':moduloId/:clausulaId')
  removeClausulaFromModulo(
    @Param('moduloId', ParseIntPipe) moduloId: number,
    @Param('clausulaId', ParseIntPipe) clausulaId: number
  ): Promise<void> {
    return this.clausulaService.removeClausulaFromModulo(moduloId, clausulaId);
  }

  //Eliminar una Clausula
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.clausulaService.delete(+id);
  }
}