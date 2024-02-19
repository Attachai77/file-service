import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
  ) {}

  async sendMail() {
    const subject = 'File uploaded';
    const template = 'simple.hbs';
    const email = 'attachai.jobs@gmail.com';

    const context = {
      title: 'File uploaded',
      message: 'Your file has been uploaded successfully.',
    };

    await this.mailerService.sendMail({
      to: email,
      subject,
      template,
      context,
    });
  }
}
