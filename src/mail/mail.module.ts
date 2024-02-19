import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

@Module({
  imports: [
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (
        configService: ConfigService
      ) => ({
        transport: {
          host: configService.getOrThrow('MAIL_HOST'),
          port: +configService.getOrThrow('MAIL_PORT'),
          secure: false,
          ignoreTLS: true,
          auth: {
            user: configService.getOrThrow('MAIL_ID'),
            pass: configService.getOrThrow('MAIL_PASS'),
          },
          tls: {
            rejectUnauthorized: false,
          },
        },
        defaults: {
          from: `File Service <${configService.getOrThrow('MAIL_ID')}>`,
        },
        template: {
          dir: join(__dirname, 'templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    })
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
