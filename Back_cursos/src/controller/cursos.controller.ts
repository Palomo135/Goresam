import { DetallePalabraClave } from 'src/modelo/detallePalabraClave.entity';
import { Body, Controller, Delete, Get, Param, Post, Put, UploadedFile, UseInterceptors, Res, NotFoundException } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Response } from 'express';
import { Curso } from "src/modelo/curso.entity";
import { CursoService } from "src/service/implements/cursosImple.service";
import { BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { CursoDTO } from "src/DTO/curso.DTO";
import { InjectRepository } from "@nestjs/typeorm";
import { CursoEditDTO } from 'src/DTO/cursoEdit.DTO';
import { DetallePalabraClaveDTO } from "src/DTO/detallePalabraClave.DTO";
import { CursoElistDTO } from 'src/DTO/cursoElist.DTO';
import { Repository } from 'typeorm';
import { multerConfig, multerOptions } from '../multer.config'; // Configuración de Multer
import { promises as fs } from 'fs'; // Para leer el archivo como Buffer
import { join } from 'path'; // Para manejar rutas


@Controller('curso')
export class CursoController {
  constructor(private readonly cursoService: CursoService,
    @InjectRepository(Curso)
    private readonly cursoRepository: Repository<Curso>,
  ) { }

  @Get('logo/:id')
  async getLogo(@Param('id') id: number, @Res() res: Response): Promise<void> {
    const curso = await this.cursoService.getLogo(id);
    if (!curso || !curso.logo) {
      throw new NotFoundException('Logo no encontrado para este curso');
    }

    res.setHeader('Content-Type', 'image/jpeg'); // Ajusta según el formato real del logo
    res.send(curso.logo);
  }


  @Get()
  findElistAll(): Promise<CursoElistDTO[]> {
    return this.cursoService.findElistAll();
  }

  @Get()
  findAll(): Promise<Curso[]> {
    return this.cursoService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.cursoService.findOne(id);
  }

  @Post()
  @UseInterceptors(FileInterceptor('logo', { storage: multerConfig.storage, fileFilter: multerOptions.fileFilter }))
  async create(@UploadedFile() file: Express.Multer.File, @Body() body: CursoDTO) {
    // Si se sube un archivo, asignar el logo
    if (file) {
      //cursoEntity.logo = await fs.readFile(file.path); // Guardar el logo como Buffer
      body.logo = await fs.readFile(file.path);
    }

    // Pasar la entidad al servicio para guardarla
    return this.cursoService.create(body);
  }


  @Put(':id')
  @UseInterceptors(FileInterceptor('logo', { storage: multerConfig.storage, fileFilter: multerOptions.fileFilter })) // Permite cargar un archivo (logo)
  async update(@Param('id') id: number, @UploadedFile() file: Express.Multer.File, @Body() body: CursoDTO) {

    if (file) {
      // Leer el archivo si se proporciona
      body.logo = await fs.readFile(file.path);
    }

    // Llamar al servicio para realizar la actualización
    return this.cursoService.update(id, body);
  }

  @Delete(':id')
  delete(@Param('id') id: number): Promise<void> {
    return this.cursoService.remove(id);
  }
}