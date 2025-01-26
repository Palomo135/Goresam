import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DetalleModCla } from "src/modelo/detalleModCla.entity";
import { ClausulaModule } from "./clausula.module";
import { ModuloModule } from "./modulo.module";
import { DetalleModClaController } from "src/controller/detalleModCla.controller";
import { DetalleModClaService } from "src/service/implements/DetMoClaInterf.service";
import { DetalleModClaRepository } from "src/repository/detalleModCla.repository";
import { Modulo } from "src/modelo/modulo.entity";
import { Clausula } from "src/modelo/clausula.entity";

@Module({
    imports: [TypeOrmModule.forFeature([DetalleModCla]), ClausulaModule, ModuloModule],
    controllers: [DetalleModClaController],
    providers: [DetalleModClaService, DetalleModClaRepository],
})
export class DetalleModClaModule {}