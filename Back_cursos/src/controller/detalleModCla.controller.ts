import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { Clausula } from "src/modelo/clausula.entity";
import { DetalleModCla } from "src/modelo/detalleModCla.entity";
import { Modulo } from "src/modelo/modulo.entity";
import { DetalleModClaService } from "src/service/implements/DetMoClaInterf.service";

@Controller('detalleModCla')
export class DetalleModClaController{
    
    constructor(private readonly detalleModClaService: DetalleModClaService) {}

    //obtener todos los detallrs
    @Get()
    async findAll(): Promise<DetalleModCla[]>{
        return this.detalleModClaService.findAll();
    }

    //obtener etiqueta por id
    @Get(':id')
    async findById(@Param('id')id: number): Promise<DetalleModCla>{
        return this.detalleModClaService.findById(id);
    }

    //crear detalle
    //  @Post()
    //  async create(
    //     @Body()detalleModCla: Partial<DetalleModCla>,
    //     @Body('clausula') clausula: Clausula,
    //     @Body('modulo') modulo: Modulo,
    //  ): Promise<DetalleModCla>{
    //     if(!clausula){
    //         throw new BadRequestException('se debe proporcionar una clausula.');
    //     }
    //     if(!modulo){
    //         throw new BadRequestException('se debe proporcionar un modulo.');
    //     }
    //     return this.detalleModClaService.create(detalleModCla,clausula,modulo);
    //  }
    @Post()
  async create(
    @Body() body: { idClausula: number; idModulo: number },
  ): Promise<DetalleModCla> {
    const { idClausula, idModulo } = body;

    if (!idClausula) {
      throw new BadRequestException('Se debe proporcionar un ID de cláusula.');
    }

    if (!idModulo) {
      throw new BadRequestException('Se debe proporcionar un ID de módulo.');
    }

    return this.detalleModClaService.create(idModulo, idClausula);
  }

  // Actualizar un detalle
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body()
    body: { idModulo?: number; idClausula?: number; estado?: boolean },
  ): Promise<DetalleModCla> {
    const { idModulo, idClausula, estado } = body;

    return this.detalleModClaService.update(id, body, idModulo, idClausula);
  }

  // Eliminar un detalle
  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    return this.detalleModClaService.delete(id);
  }
}