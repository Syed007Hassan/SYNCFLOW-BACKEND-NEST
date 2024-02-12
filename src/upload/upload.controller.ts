import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  ParseFilePipe,
  UseInterceptors,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { UploadService } from './upload.service';
import { CreateUploadDto } from './dto/create-upload.dto';
import { UpdateUploadDto } from './dto/update-upload.dto';
import { ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Upload')
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('profilePicture')
  @UseInterceptors(FileInterceptor('file'))
  async profilePicture(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10000 }),
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    try {
      const response = await this.uploadService.uploadFile(file);
      return { success: true, data: response };
    } catch (e) {
      return { success: false, message: e.message };
    }
  }

  @Post('resume')
  @UseInterceptors(FileInterceptor('file'))
  async resume(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1000000 }),
          new FileTypeValidator({ fileType: '.(pdf|doc)' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    try {
      const response = await this.uploadService.uploadFile(file);
      return { success: true, data: response };
    } catch (e) {
      return { success: false, message: e.message };
    }
  }
}
