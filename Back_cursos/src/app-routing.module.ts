import { Module } from '@nestjs/common';
import { ClausulaModule } from './module/clausula.module';
import { ModuloModule } from './module/modulo.module';
import { CursoModule } from './module/curso.module';
import { EtiquetaModule } from './module/etiqueta.module';
import { RecursosModule } from './module/recurso.module';
import { DetalleModClaModule } from './module/detalleModCla.module';
import { PerfilModule } from './module/perfil.module';

@Module({
  imports: [
    ClausulaModule,
    ModuloModule,
    CursoModule,
    EtiquetaModule,
    RecursosModule,
    DetalleModClaModule,
    PerfilModule,
  ],
})
export class RoutingModule { }
