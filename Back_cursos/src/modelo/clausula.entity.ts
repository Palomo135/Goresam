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

  @ManyToOne(() => Modulo, (modulo) => modulo.clausulas, { onDelete: 'CASCADE', })
  modulo: Modulo;

  @CreateDateColumn()
  fechaCreate: Date;

  @UpdateDateColumn()
  fechaUpdate: Date;

  @Column()
  estado: boolean;
}
