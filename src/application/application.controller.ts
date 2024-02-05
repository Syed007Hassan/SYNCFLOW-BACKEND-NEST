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
import { ApiOperation, ApiTags } from '@nestjs/swagger';

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

  @Get('findByJobId/:jobId')
  @ApiOperation({
    summary: 'Find application by job ID, for recruiter use only',
  })
  async findByJobid(@Param('jobId') jobId: string) {
    try {
      const application = await this.applicationService.findByJobId(+jobId);
      return { success: true, data: application };
    } catch (err) {
      return { success: false, message: err.message };
    }
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
