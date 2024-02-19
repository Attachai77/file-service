import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const logger = new Logger();

  try {
    await app.listen(3000, '0.0.0.0');
    logger.log(`Server running on port ${await app.getUrl()}`);
  } catch (error) {
    logger.error(error, '<--- error');
  }
}

bootstrap();
