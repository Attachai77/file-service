import {
  Controller,
  HttpStatus,
  InternalServerErrorException, MaxFileSizeValidator, ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from './file.service';
import { ConfigService } from '@nestjs/config';

@Controller('file')
export class FileController {

  constructor(
    private readonly fileService: FileService,
  ) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      const resp = await this.fileService.upload(file);

      return  {
        statusCode: HttpStatus.CREATED,
        message: 'File uploaded successfully',
        data: resp,
      }
    } catch (e) {
      if(e.status) throw e;
      throw new InternalServerErrorException(e.message);
    }
  }
}
