import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Encargado } from "src/modelo/encargado.entity";
import { EncargadoController } from "src/controller/encargado.controller";
import { EncargadoRepository } from "src/repository/encargado.repository";
import { EncargadoService } from "src/service/implements/encargadoImple.service";

@Module({
    imports: [TypeOrmModule.forFeature([Encargado])],
    controllers: [EncargadoController],
    providers: [EncargadoService, EncargadoRepository],
    exports: [TypeOrmModule]
})
export class EncargadoModule { }