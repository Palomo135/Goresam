import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';


async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors({
    origin: '*', // Permitir solicitudes de cualquier origen
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Si necesitas enviar cookies o autenticación
  });

  app.setGlobalPrefix('api');

  // Servir archivos estáticos desde el directorio ./uploads
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads', // Esto define la ruta base para los archivos
  });

  await app.listen(process.env.PORT ?? 3200);
  console.log("iniciando en puerto: ", process.env.PORT ?? 3200);
}
bootstrap();
