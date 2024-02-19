import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  const logger = new Logger();

  try {
    await app.listen(3000, '0.0.0.0');
    logger.log(`Server running on port ${await app.getUrl()}`);
  } catch (error) {
    logger.error(error, '<--- error');
  }
}

bootstrap();
