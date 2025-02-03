import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Encargado } from 'src/modelo/encargado.entity';
import { Repository } from 'typeorm';
import { EncargadoRepository } from 'src/repository/encargado.repository';

@Injectable()
export class EncargadoService {
    constructor(
        // @InjectRepository(EncargadoRepository)
        // private readonly encargadoRepository: EncargadoRepository,
        @InjectRepository(Encargado)
        private readonly encargadoRepository: Repository<Encargado>
    ) { }

    findAll(): Promise<Encargado[]> {
        return this.encargadoRepository.find();
    }

    findOne(id: number): Promise<Encargado> {
        return this.encargadoRepository.findOne({ where: { id } })
    }

    create(encargado: Encargado): Promise<Encargado> {
        return this.encargadoRepository.save(encargado);
    }
}