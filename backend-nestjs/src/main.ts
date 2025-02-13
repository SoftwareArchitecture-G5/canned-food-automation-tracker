import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: process.env.FRONTEND_URL, // Adjust accordingly
    credentials: true,
  });
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
