import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Encargado } from 'src/modelo/encargado.entity';
import { EncargadoRepository } from 'src/repository/encargado.repository';

@Injectable()
export class EncargadoService {
    constructor(
        @InjectRepository(EncargadoRepository)
        private readonly encargadoRepository: EncargadoRepository,
    ) { }

    findAll(): Promise<Encargado[]> {
        return this.encargadoRepository.find();
    }

    create(encargado: Encargado): Promise<Encargado> {
        return this.encargadoRepository.save(encargado);
    }
}