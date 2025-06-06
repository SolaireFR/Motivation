import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap(): Promise<void> {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);

    // Configuration CORS
    app.enableCors();

    // Configuration de la validation globale
    app.useGlobalPipes(new ValidationPipe());

    // Configuration Swagger
    const config = new DocumentBuilder()
        .setTitle(configService.get<string>('swagger.title') ?? 'API Documentation')
        .setDescription(configService.get<string>('swagger.description') ?? 'API Description')
        .setVersion(configService.get<string>('swagger.version') ?? '1.0')
        .addTag('Taches', 'Gestion des tâches')
        .addTag('Budget', 'Gestion du budget')
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(configService.get<string>('swagger.path') ?? 'api', app, document);
    const port = configService.get<number>('port') ?? 3000; // Add default port
    await app.listen(port);
    console.log(`Application is running on: http://localhost:${port}`);
    console.log(
        `Swagger documentation is available at: http://localhost:${port}/${configService.get<string>('swagger.path')}`,
    );
}

bootstrap();
