import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost', // Cambiar si tienes otro host
  port: 5432,        // Puerto de PostgreSQL
  username: 'postgres', // Usuario de tu base de datos
  password: 'lunera12', // Contraseña de tu base de datos
  database: 'ciberseguridad', // Nombre de la base de datos
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  synchronize: true, // Sincroniza el esquema automáticamente
};
