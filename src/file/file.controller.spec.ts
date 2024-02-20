import { Test, TestingModule } from '@nestjs/testing';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { MailService } from '../mail/mail.service';

describe('FileController', () => {
  let controller: FileController;
  let fileService: FileService;
  let mailService: MailService;

  const mockFile = {
    buffer: Buffer.from(''),
    mimetype: 'image/jpeg',
    size: 1048576,
    fieldname: 'file',
    originalname: 'file.jpg',
    encoding: '7bit',
    destination: '',
    filename: '',
    path: '',
    stream: null,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        FileController,
      ],
      providers: [
        {
          provide: FileService,
          useValue: {
            upload: jest.fn(),
          },
        },
        {
          provide: MailService,
          useValue: {
            sendUploadedEmail: jest.fn(),
          },
        }
      ]
    }).compile();

    controller = module.get<FileController>(FileController);
    fileService = module.get<FileService>(FileService);
    mailService = module.get<MailService>(MailService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should upload file & send mail correctly', async () => {
    const body = {
      email: 'mock@mail.com',
    };

    jest.spyOn(fileService, 'upload').mockResolvedValue({
      requestId: 'requestId',
    });

    jest.spyOn(mailService, 'sendUploadedEmail').mockResolvedValue(void 0);

    expect(await controller.uploadFile(mockFile, body)).toStrictEqual({
      statusCode: 201,
      message: 'File uploaded successfully',
      data: {
        requestId: 'requestId',
      },
    });

    expect(fileService.upload).toHaveBeenCalledWith(mockFile);
    expect(mailService.sendUploadedEmail).toHaveBeenCalledWith(body.email, mockFile.originalname);
  });

});
