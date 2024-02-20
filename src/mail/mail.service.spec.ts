import { Test, TestingModule } from '@nestjs/testing';
import { MailService } from './mail.service';
import { MailerService } from '@nestjs-modules/mailer';

describe('MailService', () => {
  let service: MailService;
  let mailerService: MailerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MailService,
        {
          provide: MailerService,
          useValue: {
            sendMail: jest.fn(),
          },
        }
      ],
    }).compile();

    service = module.get<MailService>(MailService);
    mailerService = module.get<MailerService>(MailerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('sendMail() should be defined', () => {
    expect(service.sendMail).toBeDefined();
  })

  it('sendUploadedEmail() should be defined', () => {
    expect(service.sendUploadedEmail).toBeDefined();
  })

  it('sendMail() should call mailerService.sendMail()', () => {
    const payload = {
      email: 'mock-receiver@mail.com',
      subject: 'Subject Test',
      template: 'mock.hbs',
      context: {
        message: 'Mail content mock'
      }
    }

    service.sendMail(payload);
    expect(mailerService.sendMail).toHaveBeenCalledWith({
      to: payload.email,
      subject: payload.subject,
      template: payload.template,
      context: payload.context
    });
  })

  it('sendUploadedEmail() should call sendMail()', () => {
    const sendMailSpy = jest.spyOn(service, 'sendMail');
    const email = 'mock-receiver@mail.com'
    const fileName = 'mock-file-name'

    service.sendUploadedEmail(email, fileName);
    expect(sendMailSpy).toHaveBeenCalledWith({
      email,
      subject: 'File uploaded',
      template: 'simple.hbs',
      context: {
        title: 'File uploaded',
        message: `Your file ${fileName} has been uploaded successfully.`,
      }
    });
  });
});
