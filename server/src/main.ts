import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Default allowed origins for local development
  const defaultOrigins = [
    'http://localhost:5173',
    'http://localhost:8081',
    'http://127.0.0.1:8081',
    'https://localhost:3000',
    'http://localhost:3000',
  ];
  
  // Get CORS origins from environment variable (for production)
  const envOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN
        .split(',')
        .map((origin) => origin.trim())
        .filter(Boolean)
    : [];

  // Combine all allowed origins
  const allOrigins = [...new Set([...defaultOrigins, ...envOrigins])];
  
  // Separate wildcard domains from exact origins
  const exactOrigins = allOrigins.filter((origin) => !origin.includes('*'));
  const wildcardPatterns = allOrigins.filter((origin) => origin.includes('*'));

  // Convert wildcard patterns (e.g., "*.vercel.app") to regex suffixes
  const wildcardSuffixes = wildcardPatterns.map((pattern) => pattern.replace('*.', ''));

  // Enable CORS with comprehensive configuration
  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests without origin (like mobile apps, Postman, etc.)
      if (!origin) {
        return callback(null, true);
      }

      // Check exact origin match
      if (exactOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Check wildcard domain match
      const isWildcardMatch = wildcardSuffixes.some((suffix) => origin.endsWith(suffix));
      if (isWildcardMatch) {
        return callback(null, true);
      }

      // Origin not allowed
      console.warn(`CORS: Blocked origin ${origin}`);
      return callback(new Error(`Origin ${origin} not allowed by CORS`), false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin'],
  });
  
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
  app.setGlobalPrefix('api');
  
  await app.listen(process.env.PORT ?? 3000);
  console.log(`Application is running on: http://localhost:${process.env.PORT ?? 3000}`);
  console.log(`CORS allowed origins: ${allOrigins.join(', ')}`);
}
bootstrap();
