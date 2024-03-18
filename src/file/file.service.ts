import { BadRequestException, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { AwsService } from '../aws/aws.service';
import { ConfigService } from '@nestjs/config';
import { GetPresignedUrlDto } from './file.dto';

@Injectable()
export class FileService {

  constructor(
    private readonly configService: ConfigService,
    private readonly awsService: AwsService,
  ) {}

  upload(file: Express.Multer.File) {
    this.validateFile(file);

    const buffer = file.buffer;
    const mimeType = file.mimetype;
    const fileName = `${uuidv4()}.${mimeType.split('/')[1]}`;

    return this.awsService.uploadToS3(buffer, fileName);
  }

  private validateFile(file: Express.Multer.File) {
    if(!file) throw new BadRequestException('No file uploaded');

    const uploadMimeTypes = this.configService.getOrThrow('UPLOAD_MIMETYPES');
    const allowedMimeTypes = uploadMimeTypes.split(',');

    const uploadSizeLimit = +this.configService.getOrThrow('UPLOAD_SIZE_LIMIT');
    const allowedSize = 1024 * 1024 * uploadSizeLimit;

    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('Invalid file type, only JPEG, PNG and PDF are allowed');
    }

    if (file.size > allowedSize) {
      throw new BadRequestException(`File size too large, max size is ${allowedSize / (1024 * 1024)}MB`);
    }
  }

  async getFile(fileName: string) {
    if(!fileName) throw new BadRequestException('No file name provided');

    const url = await this.awsService.getSignedUrlS3(fileName);

    return {
      url,
      fileName
    }
  }

  async getPresignedUrl(body: GetPresignedUrlDto) {
    const fileExt = body.fileName.split('.').pop();
    if(!fileExt) throw new BadRequestException('Invalid file name');

    const fileKey = `${uuidv4()}.${fileExt}`;
    const url = await this.awsService.generatePresignedUrl(fileKey);

    return {
      url,
      fileKey
    }
  }

}
