import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApplicationService } from './application.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { HasRoles } from 'src/auth/decorators/has-roles.decorator';
import { JwtGuard } from 'src/auth/guards/jwt-auth.guard';
import { RoleGuard } from 'src/auth/guards/role-auth.guard';
import { Role } from 'src/auth/model/role.enum';
import { CacheTTL } from '@nestjs/cache-manager';

@ApiTags('Application')
@Controller('application')
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  @ApiBearerAuth()
  @HasRoles(Role.Employee)
  @UseGuards(JwtGuard, RoleGuard)
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

  @CacheTTL(30)
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

  @ApiBearerAuth()
  @HasRoles(Role.Employer)
  @UseGuards(JwtGuard, RoleGuard)
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

  @ApiBearerAuth()
  @HasRoles(Role.Employer)
  @UseGuards(JwtGuard, RoleGuard)
  @Patch('updateApplicationFeedback/:jobId/:applicantId')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        applicationFeedback: {
          type: 'string',
          description: 'The feedback for the application',
        },
      },
    },
  })
  async updateApplicationFeedback(
    @Param('jobId') jobId: string,
    @Param('applicantId') applicantId: string,
    @Body('applicationFeedback') applicationFeedback: string,
  ) {
    try {
      const application =
        await this.applicationService.updateApplicationFeedback(
          +jobId,
          +applicantId,
          applicationFeedback,
        );
      return { success: true, data: application };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }

  @ApiBearerAuth()
  @HasRoles(Role.Employer)
  @UseGuards(JwtGuard, RoleGuard)
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
