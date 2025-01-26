import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RecursosController } from "src/controller/recursos.controller";
import { Recursos } from "src/modelo/recursos.entity";
import { RecursosRepository } from "src/repository/recursos.repository";
import { RecursosService } from "src/service/implements/recursosImple.service";

@Module({
    imports: [TypeOrmModule.forFeature([Recursos])],
    controllers: [RecursosController],
    providers: [RecursosService, RecursosRepository],
    exports: [TypeOrmModule]
})
export class RecursosModule {}