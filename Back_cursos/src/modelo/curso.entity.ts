import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Modulo } from './modulo.entity';
import { DetallePalabraClave } from './detallePalabraClave.entity';

@Entity('cursos')
export class Curso {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nombre: string;

    @Column()
    descripcion: string;

    @Column({ type: 'bytea' })
    logo: Buffer;

    @Column({ nullable: true })
    frase?: string;

    @Column({ nullable: true })
    dirigido?: string;

    @Column({ nullable: true })
    aprendizaje?: string;

    @Column({ nullable: true })
    requisitos?: string;

    @Column({ nullable: true })
    reconocimiento?: string;

    @CreateDateColumn()
    fechaCreate: Date;

    @UpdateDateColumn()
    fechaUpdate: Date;

    @Column({ nullable: true })
    fechaInicio: Date;

    @Column({ nullable: true })
    fechaCaducidad: Date;

    @Column()
    encargado: string;

    @Column()
    estado: boolean;

    @Column()
    recurso: string;

    @OneToMany(() => Modulo, (modulo) => modulo.curso, { cascade: true }) // Relación con Modulo
    modulos: Modulo[];

    @OneToMany(() => DetallePalabraClave, detallePalabraClave => detallePalabraClave.curso, { cascade: true })
    detallePalabrasClave: DetallePalabraClave[];

}