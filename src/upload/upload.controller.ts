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
  UseGuards,
} from '@nestjs/common';
import { UploadService } from './upload.service';
import { CreateUploadDto } from './dto/create-upload.dto';
import { UpdateUploadDto } from './dto/update-upload.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiProperty,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { HasRoles } from 'src/auth/decorators/has-roles.decorator';
import { Role } from 'src/auth/model/role.enum';
import { JwtGuard } from 'src/auth/guards/jwt-auth.guard';
import { RoleGuard } from 'src/auth/guards/role-auth.guard';

@ApiTags('Upload')
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @ApiBearerAuth()
  @HasRoles(Role.Employee)
  @UseGuards(JwtGuard, RoleGuard)
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

  @ApiBearerAuth()
  @HasRoles(Role.Employee)
  @UseGuards(JwtGuard, RoleGuard)
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

  @ApiBearerAuth()
  @HasRoles(Role.Employer)
  @UseGuards(JwtGuard, RoleGuard)
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
