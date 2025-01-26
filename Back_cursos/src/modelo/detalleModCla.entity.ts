import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Modulo } from "./modulo.entity";
import { Clausula } from "./clausula.entity";

@Entity('detalleModuloClausula')
export class DetalleModCla{

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Modulo)
    @JoinColumn({ name: 'idModulo' })
    modulo: Modulo;

    @ManyToOne(() => Clausula)
    @JoinColumn({ name: 'idClausula' })
    clausula: Clausula;
    
    @CreateDateColumn()
    fechaCreate: Date;

    @UpdateDateColumn()
    fechaUpdate: Date;

    @Column()
    estado: boolean;

}