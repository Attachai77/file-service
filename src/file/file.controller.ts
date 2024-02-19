import {
  Controller,
  HttpStatus,
  InternalServerErrorException,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from './file.service';
import { MailService } from '../mail/mail.service';

@Controller('file')
export class FileController {

  constructor(
    private readonly fileService: FileService,
    private readonly mailService: MailService,
  ) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      const resp = await this.fileService.upload(file);

      this.mailService.sendMail();

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
