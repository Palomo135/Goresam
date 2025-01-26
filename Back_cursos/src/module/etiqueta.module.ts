import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EtiquetaController } from "src/controller/etiqueta.controller";
import { Etiqueta } from "src/modelo/etiqueta.entity";
import { EtiquetaRepository } from "src/repository/etiqueta.repository";
import { EtiquetaService } from "src/service/implements/etiquetaImple.service";

@Module({
    imports: [TypeOrmModule.forFeature([Etiqueta])],
    controllers: [EtiquetaController],
    providers: [EtiquetaService, EtiquetaRepository],
    exports: [TypeOrmModule]
})
export class EtiquetaModule{}