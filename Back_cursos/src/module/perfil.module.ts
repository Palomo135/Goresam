import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Perfil } from '../modelo/perfil.entity';
import { PerfilController } from '../controller/perfil.controller';
import { PerfilService } from '../service/implements/perfilImple.service';
import { PerfilRepository } from '../repository/perfil.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Perfil])], // Importa el módulo TypeORM para la entidad Perfil
  controllers: [PerfilController], // Registra el controlador
  providers: [PerfilService, PerfilRepository], // Registra el servicio y el repositorio
})
export class PerfilModule {}