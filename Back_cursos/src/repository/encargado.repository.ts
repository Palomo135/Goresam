import { EntityRepository, Repository } from 'typeorm';
import { Encargado } from 'src/modelo/encargado.entity';

@EntityRepository(Encargado)
export class EncargadoRepository extends Repository<Encargado> { }