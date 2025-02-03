import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

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
}