import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from '@aws-sdk/client-s3';

@Injectable()
export class AwsService {
  private readonly s3Client = new S3({
    region: this.configService.getOrThrow('AWS_S3_REGION'),
    credentials: {
      accessKeyId: this.configService.getOrThrow('AWS_S3_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.getOrThrow('AWS_S3_SECRET_ACCESS_KEY'),
    }
  })

  constructor(
    private readonly configService: ConfigService
  ) {}

  async uploadToS3(buffer: Buffer, fileName: string) {
    const AWS_S3_BUCKET = this.configService.getOrThrow('AWS_S3_BUCKET')

    const s3Resp = await this.s3Client.putObject({
      Bucket: AWS_S3_BUCKET,
      Key: fileName,
      Body: buffer
    })

    return {
      requestId: s3Resp?.$metadata?.requestId,
    }
  }
}
