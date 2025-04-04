import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';
import * as winston from 'winston';
import { WinstonModule } from 'nest-winston';

async function bootstrap() {
  const winstonLogger = winston.createLogger({
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.printf(({ timestamp, level, message, context }) => {
        return `${timestamp} [${context || 'Application'}] ${level}: ${message}`;
      })
    ),
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.timestamp(),
          winston.format.printf(({ timestamp, level, message, context }) => {
            return `${timestamp} [${context || 'Application'}] ${level}: ${message}`;
          })
        ),
      }),
      new winston.transports.File({ 
        filename: 'logs/error.log', 
        level: 'error',
        dirname: 'logs',
        maxsize: 10485760,
        maxFiles: 5,
      }),
      new winston.transports.File({ 
        filename: 'logs/combined.log',
        dirname: 'logs',
        maxsize: 10485760,
        maxFiles: 5,
      }),
    ],
  });

  const logger = new Logger('Bootstrap');
  
  logger.log('Initializing application...');
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      instance: winstonLogger,
    }),
  });

  logger.log(`Enabling CORS with origin: ${process.env.FRONTEND_URL}`);
  app.enableCors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  });

  logger.log('Setting up Swagger documentation...');
  const config = new DocumentBuilder()
    .setTitle('Canned Food Automation Tracker API')
    .setDescription('An API description for Canned Food Automation Tracker Application')
    .setVersion('1.0')
    .addTag('List of avaiable API')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  logger.log(`Application listening on port ${port}`);
}

bootstrap().catch(err => {
  const logger = new Logger('Bootstrap');
  logger.error(`Failed to start application: ${err.message}`, err.stack);
});