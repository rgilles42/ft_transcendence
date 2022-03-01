import { configService } from 'src/config/config.service';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { validationFilter } from './validations/validation.filter';
import { validationPipe } from './validations/validation.pipe';
import * as fs from 'fs';

async function bootstrap() {

  let httpsOptions = undefined;

  if (configService.isProduction()) {
    httpsOptions = {
      key: fs.readFileSync('/etc/ssl/private/key.pem'),
      cert: fs.readFileSync('/etc/ssl/certs/cert.pem'),
    }
  }

  const app = await NestFactory.create(AppModule, {
    httpsOptions,
  });

  app.enableCors(configService.getCorsConfig());

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
