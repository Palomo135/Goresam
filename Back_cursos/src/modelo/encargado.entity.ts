import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Curso } from './curso.entity';

@Entity()
export class Encargado {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nombre: string;

    @Column()
    descripcion: string;

    @Column()
    imagen: string;

    @Column({ default: 'docente' })
    rol: string;

    @OneToMany(() => Curso, curso => curso.encargado)
    curso: Curso[];
}