import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ISendEmail } from './interface';


@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
  ) {}

  sendMail(data: ISendEmail) {
    return this.mailerService.sendMail({
      to: data.email,
      subject: data.subject,
      template: data.template,
      context: data.context,
    });
  }

  sendUploadedEmail(
    email: string,
    fileName: string
  ) {
    const subject = 'File uploaded';
    const template = 'simple.hbs';

    const context = {
      title: 'File uploaded',
      message: `Your file ${fileName} has been uploaded successfully.`,
    };

    return this.sendMail({ email, subject, template, context });
  }
}
