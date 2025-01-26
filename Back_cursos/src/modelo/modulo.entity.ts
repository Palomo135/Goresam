import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Clausula } from "./clausula.entity";
import { Curso } from "./curso.entity";

@Entity('modulo')
export class Modulo {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @ManyToOne(() => Curso, (curso) => curso.modulos, { onDelete: 'CASCADE' }) // Relación con Curso
  curso: Curso;

  @OneToMany(() => Clausula, (clausula) => clausula.modulo, { cascade: true })
  clausulas: Clausula[];

  @ManyToOne(() => Clausula, (caches) => caches.modulo, { onDelete: 'CASCADE' })
  clausula: Clausula;

  @CreateDateColumn()
  fechaCreate: Date;

  @UpdateDateColumn()
  fechaUpdate: Date;

  @Column()
  estado: boolean;

  @Column()
  orden: number;
}