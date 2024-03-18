import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UploadDto {
  @IsEmail()
  email: string;
}

export class GetPresignedUrlDto {
  @IsString()
  @IsNotEmpty()
  fileName: string;
}