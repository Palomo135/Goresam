import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Recursos } from './recursos.entity';
import { Modulo } from './modulo.entity';

@Entity('clausula')
export class Clausula {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @CreateDateColumn()
  fechaCreate: Date;

  @UpdateDateColumn()
  fechaUpdate: Date;

  @Column()
  estado: boolean;
}
