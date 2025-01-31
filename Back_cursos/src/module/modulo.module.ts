import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ModuloController } from "src/controller/modulo.controller";
import { Modulo } from "src/modelo/modulo.entity";
import { ModuloImpleService } from "src/service/implements/moduloImple.service";
import { CursoModule } from "./curso.module";
import { Curso } from "src/modelo/curso.entity";
import { ModuloRepository } from "src/repository/modulo.repository";
import { ClausulaRepository } from "src/repository/clausula.repository";
import { Clausula } from "src/modelo/clausula.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Modulo, Curso, Clausula]), CursoModule],
    controllers: [ModuloController],
    providers: [ModuloImpleService, ModuloRepository, ClausulaRepository],
    exports: [TypeOrmModule]
})
export class ModuloModule { }