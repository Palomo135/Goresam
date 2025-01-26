import { Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('usuario')
export class Usuario{
    @PrimaryGeneratedColumn()
    id: number;
}