import {
  Body,
  Controller, Get,
  HttpStatus,
  InternalServerErrorException, Param,
  Post, Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from './file.service';
import { MailService } from '../mail/mail.service';
import { IsEmail } from 'class-validator';
import { GetPresignedUrlDto, UploadDto } from './file.dto';

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
    @Body() body: UploadDto,
  ) {
    try {
      const resp = await this.fileService.upload(file);

      this.mailService.sendUploadedEmail(body.email,  file.originalname,);

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

  @Post('/presigned-url')
  async getPresignedUrl(
    @Body() body: GetPresignedUrlDto
  ) {
    try {
      const resp = await this.fileService.getPresignedUrl(body);
      return {
        statusCode: HttpStatus.OK,
        message: 'Presigned url generated successfully',
        data: resp,
      }
    } catch (e) {
      if(e.status) throw e;
      throw new InternalServerErrorException(e.message);
    }
  }

  @Get('/:id')
  async getFile(
    @Param('id') id: string
  ) {
    try {
      const resp = await this.fileService.getFile(id);
      return {
        statusCode: HttpStatus.OK,
        message: 'File retrieved successfully',
        data: resp,
      }
    } catch (e) {
      if(e.status) throw e;
      throw new InternalServerErrorException(e.message);
    }
  }
}
