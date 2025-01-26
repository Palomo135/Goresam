import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from '@nestjs/platform-express';
import { RecursosService } from './../service/implements/recursosImple.service';
import { Recursos } from "src/modelo/recursos.entity";
import { RecursosDTO } from 'src/dto/recursos.dto';

@Controller('recurso')
export class RecursosController {
  constructor(private readonly recursosService: RecursosService) {}


// Crear un nuevo recurso
@Post()
@UseInterceptors(FileInterceptor('archivo'))
async create(
  @UploadedFile() archivo: Express.Multer.File,
  @Body() body: Partial<Recursos>,
): Promise<Recursos> {
  if (!archivo) {
    throw new BadRequestException('No se ha subido un archivo.');
  }

  // Validar el nombre del archivo
  const nombreArchivo = archivo.originalname;
  const caracteresEspeciales =  /^[a-zA-Z0-9\-_]+\.[a-zA-Z0-9]+$/; // Permite letras, números, guion, guion bajo y un punto como separador de extensión

  if (!caracteresEspeciales.test(nombreArchivo)) {
    throw new BadRequestException('El nombre del archivo contiene caracteres especiales. Por favor, cámbielo.');
  }

  // Construir el objeto del recurso
  const recurso: Partial<Recursos> = {
    ...body,
    archivo: archivo.buffer,
    tamanio: archivo.size.toString(),
    extension: nombreArchivo.split('.').pop(),
    tipo: archivo.mimetype,
    nombre: nombreArchivo,
  };

  return this.recursosService.create(recurso);
}


  // Obtener todos los recursos
  @Get()
  async findAll(): Promise<Recursos[]> {
    return this.recursosService.findAll();
  }

  // Obtener un recurso por ID
  @Get(':id')
  async findById(@Param('id') id: number): Promise<Recursos> {
    return this.recursosService.findById(id);
  }

  // Actualizar un recurso existente
   @Put(':id')
  @UseInterceptors(FileInterceptor('archivo'))
  async update(
    @Param('id') id: number,
    @UploadedFile() archivo: Express.Multer.File,
    @Body() body: Partial<Recursos>,
  ): Promise<RecursosDTO> {
    if (!archivo) {
      throw new BadRequestException('No se ha subido un archivo.');
    }

    // Validar el nombre del archivo
    const nombreArchivo = archivo.originalname;
    const caracteresEspeciales =  /^[a-zA-Z0-9\-_]+\.[a-zA-Z0-9]+$/; 

    if (!caracteresEspeciales.test(nombreArchivo)) {
      throw new BadRequestException('El nombre del archivo contiene caracteres especiales. Por favor, cámbielo.');
    }

    // Construir el objeto del recurso actualizado
    const recursoActualizado: Partial<Recursos> = { ...body };

    recursoActualizado.archivo = archivo.buffer;
    recursoActualizado.tamanio = archivo.size.toString();
    recursoActualizado.extension = nombreArchivo.split('.').pop();
    recursoActualizado.tipo = archivo.mimetype;
    recursoActualizado.nombre = nombreArchivo;

    return this.recursosService.update(id, recursoActualizado);
  }

  // Eliminar un recurso
  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    await this.recursosService.delete(id);
  }
}
