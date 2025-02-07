import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Encargado } from "src/modelo/encargado.entity";
import { EncargadoController } from "src/controller/encargado.controller";
import { EncargadoRepository } from "src/repository/encargado.repository";
import { EncargadoService } from "src/service/implements/encargadoImple.service";
import { Curso } from "src/modelo/curso.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Encargado, Curso])],
    controllers: [EncargadoController],
    providers: [EncargadoService, EncargadoRepository],
    exports: [TypeOrmModule, EncargadoService]
})
export class EncargadoModule { }