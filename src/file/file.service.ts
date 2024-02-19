import { Injectable } from '@nestjs/common';
import { uuid } from 'uuidv4';
import { AwsService } from '../aws/aws.service';

@Injectable()
export class FileService {

  constructor(
    private readonly awsService: AwsService,
  ) {}

  upload(file: Express.Multer.File) {
    const buffer = file.buffer;
    const mimeType = file.mimetype;
    const fileName = `${uuid()}.${mimeType.split('/')[1]}`;


    return this.awsService.uploadToS3(buffer, fileName);
  }
}
