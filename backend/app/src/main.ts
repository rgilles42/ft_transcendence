import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { HttpException, ValidationError, ValidationPipe } from '@nestjs/common';
import { validationFilter } from './validations/validation.filter';
import { ValidationException } from './validations/validation.exception';
import { validationPipe } from './validations/validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ['http://localhost:8080', 'http://127.0.0.1:8080'],
    credentials: true,
  });

  app.use(cookieParser());

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Backend API Docs')
    .setDescription('The backend of ft_transcendence')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'access_token',
    )
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  app.useGlobalFilters(validationFilter);

  app.useGlobalPipes(validationPipe);

  await app.listen(3000, '0.0.0.0');
}
bootstrap();
