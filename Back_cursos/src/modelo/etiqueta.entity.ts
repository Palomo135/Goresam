import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('etiqueta')
export class Etiqueta{

    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn()
    fechaCreate: Date;

    @Column()
    descripcion: string;

    @Column()
    estado: boolean;

    @UpdateDateColumn()
    fechaUpdate: Date;
}