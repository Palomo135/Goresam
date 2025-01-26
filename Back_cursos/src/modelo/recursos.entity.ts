import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Clausula } from "./clausula.entity";

@Entity('recursos')
export class Recursos{
    
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    url: string;

    @Column({ type: 'bytea' }) 
    archivo: Buffer;

    @Column()
    tamanio: string;

    @Column()
    extension: string;

    @Column()
    tipo: string;
    
    @Column()
    fuente: string;
    
    @Column()
    estado: boolean;

    @Column()
    nombre: string;
}