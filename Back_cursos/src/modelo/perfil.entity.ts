import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('perfil')
export class Perfil{

    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    rol: string;

    @Column()
    descripcion: string;

    @Column({ default: true })
    estado: boolean;
    
}