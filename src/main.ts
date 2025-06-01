import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  
  // Configuration CORS
  app.enableCors();
  
  // Configuration de la validation globale
  app.useGlobalPipes(new ValidationPipe());

  // Configuration Swagger
  const config = new DocumentBuilder()
    .setTitle(configService.get('swagger.title', 'Motivation API'))
    .setDescription(configService.get('swagger.description', 'API pour la gestion des tâches et du budget de motivation'))
    .setVersion(configService.get('swagger.version', '1.0'))
    .addTag('tasks', 'Gestion des tâches')
    .addTag('budget', 'Gestion du budget')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(configService.get('swagger.path', 'api'), app, document);

  const port = configService.get('port', 3000);
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`Swagger documentation is available at: http://localhost:${port}/${configService.get('swagger.path', 'api')}`);
}

bootstrap(); 