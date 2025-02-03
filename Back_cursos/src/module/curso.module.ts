import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DetallePalabraClave } from "src/modelo/detallePalabraClave.entity";
import { CursoController } from "src/controller/cursos.controller";
import { Curso } from "src/modelo/curso.entity";
import { CursosRepository } from "src/repository/cursos.repository";
import { CursoService } from "src/service/implements/cursosImple.service";
import { EtiquetaModule } from "./etiqueta.module";
import { RecursosModule } from "./recurso.module";
import { Modulo } from "src/modelo/modulo.entity";
import { EncargadoModule } from "./encargado.module";

@Module({
    imports: [TypeOrmModule.forFeature([Curso, DetallePalabraClave, Modulo]), EtiquetaModule, RecursosModule, EncargadoModule],
    controllers: [CursoController],
    providers: [CursoService, CursosRepository,],
    exports: [TypeOrmModule]

})
export class CursoModule { }