import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: process.env.FRONTEND_URL, // Adjust accordingly
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Canned Food Automation Tracker API')
    .setDescription('An API description for Canned Food Automation Tracker Application')
    .setVersion('1.0')
    .addTag('List of avaiable API')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT || 3000);
}

bootstrap();
