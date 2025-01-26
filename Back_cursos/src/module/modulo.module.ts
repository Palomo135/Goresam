import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ModuloController } from "src/controller/modulo.controller";
import { Modulo } from "src/modelo/modulo.entity";
import { ModuloImpleService } from "src/service/implements/moduloImple.service";
import { ClausulaModule } from "./clausula.module";
import { CursoModule } from "./curso.module";

@Module({
    imports: [TypeOrmModule.forFeature([Modulo]), CursoModule],
    controllers: [ModuloController],
    providers: [ModuloImpleService],
    exports: [TypeOrmModule]
})
export class ModuloModule { }