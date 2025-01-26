import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ClausulaController } from "src/controller/clausula.controller";
import { Clausula } from "src/modelo/clausula.entity";
import { ClausulaRepository } from "src/repository/clausula.repository";
import { ClausulaService } from "src/service/implements/clausulaImple.service";
import { RecursosModule } from "./recurso.module";
import { ModuloModule } from "./modulo.module";

@Module({
    imports: [TypeOrmModule.forFeature([Clausula]),ModuloModule],
    controllers: [ClausulaController],
    providers: [ClausulaService, ClausulaRepository],
    exports: [TypeOrmModule]
})
export class ClausulaModule {}