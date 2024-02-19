import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { AwsModule } from '../aws/aws.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => [{
        ttl: configService.get('UPLOAD_RATE_TTL'),
        limit: configService.get('UPLOAD_RATE_LIMIT'),
      }],
    }),
    AwsModule
  ],
  providers: [FileService, {
    provide: APP_GUARD,
    useClass: ThrottlerGuard,
  }],
  controllers: [FileController]
})
export class FileModule {}
