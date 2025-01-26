import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Curso } from './curso.entity';

@Entity('detallePalabraClave')
export class DetallePalabraClave {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @ManyToOne(() => Curso, curso => curso.detallePalabrasClave, { onDelete: 'CASCADE', })
  @JoinColumn({ name: 'cursoId' })
  curso: Curso;
}