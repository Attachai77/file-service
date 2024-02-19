import { Injectable } from '@nestjs/common';
import { AwsService } from '../aws/aws.service';

@Injectable()
export class FileService {

  constructor(
    private readonly awsService: AwsService,
  ) {
  }

  upload(file: Express.Multer.File) {
    const buffer = file.buffer;
    const fileName = file.originalname;

    return this.awsService.uploadToS3(buffer, fileName);
  }
}
