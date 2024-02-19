import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FileModule } from './file/file.module';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [FileModule, MailModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
