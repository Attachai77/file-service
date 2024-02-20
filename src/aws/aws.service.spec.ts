import { Test, TestingModule } from '@nestjs/testing';
import { AwsService } from './aws.service';
import { ConfigService } from '@nestjs/config';
import { S3 } from '@aws-sdk/client-s3';

describe('AwsService', () => {
  let service: AwsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AwsService,
        {
          provide: ConfigService,
          useValue: {
            getOrThrow: jest.fn().mockReturnValue('configValue'),
          },
        },
        {
          provide: S3,
          useValue: {
            putObject: jest.fn(),
          }
        }
      ],
    }).compile();

    service = module.get<AwsService>(AwsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('function uploadToS3() should be defined', () => {
    expect(service.uploadToS3).toBeDefined();
  })

  it('should upload correctly, also return requestId', async () => {
    const buffer = Buffer.from('test');
    const fileName = 'test.txt';

    S3.prototype.putObject = jest.fn().mockReturnValue({
      $metadata: {
        requestId: 'uploaded-requestId'
      }
    });

    const result = await service.uploadToS3(buffer, fileName);
    expect(result).toEqual({ requestId: 'uploaded-requestId' });
  })
});
