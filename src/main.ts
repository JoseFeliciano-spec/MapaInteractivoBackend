import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuración de Swagger para Simon Movilidad
  const config = new DocumentBuilder()
    .setTitle('Simon Movilidad API')
    .setDescription(
      'API de monitoreo IoT para flotas vehiculares - Sistema de gestión de vehículos, conductores, ubicaciones GPS y datos en tiempo real. Incluye ingesta de señales, alertas predictivas y WebSockets.',
    )
    .setVersion('1.0')
    .addTag('auth', 'Autenticación y gestión de usuarios')
    .addTag('vehicles', 'Gestión de vehículos y datos GPS/combustible')
    .addTag('drivers', 'Gestión de conductores')
    .addTag('locations', 'Ingesta y monitoreo de ubicaciones GPS en tiempo real') // Agregado para tus endpoints
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Ingresa tu token JWT (validado manualmente sin librerías externas)',
        in: 'header',
      },
      'access-token',
    )
    .addServer('http://localhost:8080', 'Servidor de desarrollo')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  // Habilitar CORS con configuración segura (permite orígenes específicos para producción)
  app.enableCors({
    origin: ['http://localhost:3000', 'https://tu-frontend-app.com'], // Ajusta a tus orígenes (e.g., frontend React)
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Iniciar el servidor
  const port = process.env.PORT ?? 8080;
  await app.listen(port);
  console.log(`Aplicación corriendo en puerto ${port}`);
  console.log(`Documentación Swagger disponible en: http://localhost:${port}/docs`);
}

bootstrap();
