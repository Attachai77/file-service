import { Controller, HttpCode, HttpStatus, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from './file.service';

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
    const resp = await this.fileService.upload(file);

    return  {
      statusCode: HttpStatus.CREATED,
      message: 'ok',
      data: resp,
    }
  }
}
