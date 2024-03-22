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
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

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

  @Get('findOneById/:applicationId')
  async findOne(@Param('applicationId') applicationId: string) {
    try {
      const application = await this.applicationService.findOne(+applicationId);
      return { success: true, data: application };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }

  @Get('findAll')
  async findAll() {
    try {
      const applications = await this.applicationService.findAll();
      return { success: true, data: applications };
    } catch (err) {
      return { success: false, message: err.message };
    }
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

  @Get('findByApplicantId/:applicantId')
  @ApiOperation({
    summary: 'Find all applications by applicant ID, for applicant use only',
  })
  async findByApplicantId(@Param('applicantId') applicantId: string) {
    try {
      const application =
        await this.applicationService.findByApplicantId(+applicantId);
      return { success: true, data: application };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }

  @Get('findByJobIdAndApplicantId/:jobId/:applicantId')
  @ApiOperation({
    summary:
      'Find application by job ID and applicant ID, for applicant use only',
  })
  async findByJobIdAndApplicantId(
    @Param('jobId') jobId: string,
    @Param('applicantId') applicantId: string,
  ) {
    try {
      const application =
        await this.applicationService.findByJobIdAndApplicantId(
          +jobId,
          +applicantId,
        );
      return { success: true, data: application };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }

  @Patch('updateApplicationStage/:jobId/:applicantId/:stageId')
  async updateApplicationStage(
    @Param('jobId') jobId: string,
    @Param('applicantId') applicantId: string,
    @Param('stageId') stageId: string,
  ) {
    try {
      const application = await this.applicationService.updateApplication(
        +jobId,
        +applicantId,
        +stageId,
      );
      return { success: true, data: application };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }

  // a patch request to update the application status, status will be send in the body
  @Patch('updateApplicationStatus/:jobId/:applicantId')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          description: 'The new status of the application',
        },
      },
    },
  })
  async updateApplicationStatus(
    @Param('jobId') jobId: string,
    @Param('applicantId') applicantId: string,
    @Body('status') status: string,
  ) {
    try {
      const application = await this.applicationService.updateApplicationStatus(
        +jobId,
        +applicantId,
        status,
      );
      return { success: true, data: application };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }

  @Delete('deleteOneById:id')
  remove(@Param('id') id: string) {
    return this.applicationService.remove(+id);
  }
}
