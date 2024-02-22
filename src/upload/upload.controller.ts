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
import { ApiBody, ApiConsumes, ApiProperty, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Upload')
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post(':id/profilePicture')
  @UseInterceptors(FileInterceptor('file'))
  async profilePicture(
    @Param('id') id: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1000000 }),
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    try {
      const response = await this.uploadService.uploadProfilePicture(+id, file);
      return { success: true, data: response };
    } catch (e) {
      return { success: false, message: e.message };
    }
  }

  @Post(':id/resume')
  @UseInterceptors(FileInterceptor('file'))
  async resume(
    @Param('id') id: string,
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
      const response = await this.uploadService.uploadResume(+id, file);
      return { success: true, data: response };
    } catch (e) {
      return { success: false, message: e.message };
    }
  }

  @Post(':companyId/companyProfilePicture')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async companyProfilePicture(
    @Param('companyId') companyId: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1000000 }),
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    try {
      console.log(companyId);
      const response = await this.uploadService.uploadCompanyProfilePicture(
        +companyId,
        file,
      );
      return { success: true, data: response };
    } catch (e) {
      return { success: false, message: e.message };
    }
  }
}
