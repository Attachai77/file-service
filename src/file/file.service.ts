import { Injectable } from '@nestjs/common';

@Injectable()
export class FileService {

  upload(file: Express.Multer.File) {
    console.log(file);
  }
}
