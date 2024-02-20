import { Test, TestingModule } from '@nestjs/testing';
import { FileService } from './file.service';
import { ConfigService } from '@nestjs/config';
import { AwsService } from '../aws/aws.service';

describe('FileService', () => {
  let service: FileService;
  let awsService: AwsService;
  let configService: ConfigService;

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
      providers: [
        FileService,
        {
          provide: ConfigService,
          useValue: {
            getOrThrow: jest.fn().mockReturnValue(''),
          },
        },
        {
          provide: AwsService,
          useValue: {
            uploadToS3: jest.fn(),
          },
        }
      ],
    }).compile();

    service = module.get<FileService>(FileService);
    awsService = module.get<AwsService>(AwsService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('upload() should be defined', () => {
    expect(service.upload).toBeDefined();
  });

  it('should upload file correctly', async () => {
    configService.getOrThrow = jest.fn()
      .mockReturnValueOnce('image/jpeg,image/png,application/pdf')
      .mockReturnValueOnce('5');

    awsService.uploadToS3 = jest.fn().mockResolvedValue({
      requestId: 'requestId',
    });

    await expect(service.upload(mockFile)).resolves.toStrictEqual({
      requestId: 'requestId',
    });

    expect(awsService.uploadToS3).toHaveBeenCalledWith(mockFile.buffer, expect.any(String));
  });

  describe('filed validation cases', () => {
    it('should throw error when no file uploaded', () => {
      expect(() => service.upload(null)).toThrowError('No file uploaded');
    })

    it('should throw error when file type is not allowed', () => {
      configService.getOrThrow = jest.fn().mockReturnValueOnce('image/jpeg,image/png,application/pdf');
      mockFile.mimetype = 'image/gif'

      expect(() => service.upload(mockFile)).toThrowError('Invalid file type, only JPEG, PNG and PDF are allowed');
    })

    it('should throw error when file size is too large', () => {
      configService.getOrThrow = jest.fn()
        .mockReturnValueOnce('image/jpeg,image/png,application/pdf')
        .mockReturnValueOnce('5');

      mockFile.mimetype = 'image/jpeg';

      const sizeMB = 5.5
      mockFile.size = 1024 * 1024 * sizeMB;

      expect(() => service.upload(mockFile)).toThrowError('File size too large, max size is 5MB');
    })
  })
});
