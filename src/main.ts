import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as basicAuth from 'express-basic-auth';
import { AppModule } from './app.module';
import { ADMIN_CREDENTIALS } from './common/auth/credentials';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  app.useGlobalFilters(new HttpExceptionFilter());

  // Protect the Swagger UI with HTTP Basic auth.
  app.use(
    ['/docs', '/docs-json'],
    basicAuth({
      challenge: true,
      users: { [ADMIN_CREDENTIALS.username]: ADMIN_CREDENTIALS.password },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Pixoft API')
    .setDescription('Job marketplace backend API')
    .setVersion('1.0')
    .addBasicAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  logger.log(`API running on port ${port}`);
  logger.log('Swagger docs available at /docs');
}

bootstrap();
