import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApplicationService } from './application.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Application')
@Controller('application')
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  @Post('/createApplication/:jobId/:applicantId')
  async create(
    @Param('jobId') jobId: string,
    @Param('applicantId') applicantId: string,
    @Body() createApplicationDto: CreateApplicationDto,
  ) {
    try {
      const application = await this.applicationService.create(
        +jobId,
        +applicantId,
        createApplicationDto,
      );
      return { success: true, data: application };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }

  @Get('findAll')
  findAll() {
    return this.applicationService.findAll();
  }

  @Get('findOne:id')
  findOne(@Param('id') id: string) {
    return this.applicationService.findOne(+id);
  }

  @Patch('updateApplicationById:id')
  update(
    @Param('id') id: string,
    @Body() updateApplicationDto: UpdateApplicationDto,
  ) {
    return this.applicationService.update(+id, updateApplicationDto);
  }

  @Delete('deleteOneById:id')
  remove(@Param('id') id: string) {
    return this.applicationService.remove(+id);
  }
}
