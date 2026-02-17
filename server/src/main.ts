import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const defaultOrigins = ['http://localhost:5173', 'http://localhost:8081', 'http://127.0.0.1:8081'];
  const envOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN
        .split(',')
        .map((origin) => origin.trim())
        .filter(Boolean)
    : undefined;

  const wildcardOrigins = envOrigins
    ? envOrigins.filter((origin) => origin.startsWith('*.')).map((origin) => origin.slice(1))
    : [];

  app.enableCors({
    origin: (origin, callback) => {
      const allowList = envOrigins && envOrigins.length > 0 ? envOrigins : defaultOrigins;

      if (!origin) {
        return callback(null, true);
      }

      if (allowList.includes('*') || allowList.includes(origin)) {
        return callback(null, true);
      }

      const isWildcardMatch = wildcardOrigins.some((suffix) => origin.endsWith(suffix));
      if (isWildcardMatch) {
        return callback(null, true);
      }

      return callback(new Error(`Origin ${origin} not allowed by CORS`), false);
    },
    credentials: true,
  });
  
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
  app.setGlobalPrefix('api');
  
  await app.listen(process.env.PORT ?? 3000);
  console.log(`Application is running on: http://localhost:${process.env.PORT ?? 3000}`);
}
bootstrap();
