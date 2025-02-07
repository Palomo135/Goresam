import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/database.config';
import { PerfilModule } from './module/perfil.module';
import { RecursosModule } from './module/recurso.module';
import { ClausulaModule } from './module/clausula.module';
import { EtiquetaModule } from './module/etiqueta.module';
import { ModuloModule } from './module/modulo.module';
import { EncargadoModule } from './module/encargado.module';
import { DetalleModClaModule } from './module/detalleModCla.module';
import { CursoModule } from './module/curso.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [TypeOrmModule.forRoot(typeOrmConfig), PerfilModule, RecursosModule, ClausulaModule, EncargadoModule, EtiquetaModule, ModuloModule, DetalleModClaModule, CursoModule,
  ServeStaticModule.forRoot({
    rootPath: join(__dirname, '..', 'uploads'), // Directorio de archivos estáticos
    serveRoot: '/uploads', // Prefijo para acceder a los archivos
  }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
