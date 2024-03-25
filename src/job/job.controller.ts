import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  HttpException,
  UseGuards,
} from '@nestjs/common';
import { JobService } from './job.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { HasRoles } from 'src/auth/decorators/has-roles.decorator';
import { Role } from 'src/auth/model/role.enum';
import { JwtGuard } from 'src/auth/guards/jwt-auth.guard';
import { RoleGuard } from 'src/auth/guards/role-auth.guard';
@ApiTags('Job')
@Controller('job')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @ApiBearerAuth()
  @HasRoles(Role.Employer)
  @UseGuards(JwtGuard, RoleGuard)
  @Post('/createJob/:recruiterId/:companyId')
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Param('recruiterId') recruiterId: string,
    @Param('companyId') companyId: string,
    @Body() createJobDto: CreateJobDto,
  ) {
    try {
      const job = await this.jobService.create(
        +recruiterId,
        +companyId,
        createJobDto,
      );
      return { success: true, data: job };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }

  @Get('findAll')
  @HttpCode(HttpStatus.OK)
  async findAll() {
    try {
      const jobs = await this.jobService.findAllJobs();
      return { success: true, data: jobs };
    } catch (err) {
      throw new HttpException(
        { success: false, message: err.message },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Get('findOneByCompanyId/:id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string) {
    try {
      const job = await this.jobService.findOneByCompanyId(+id);
      console.log(job);
      return { success: true, data: job };
    } catch (err) {
      throw new HttpException(
        { success: false, message: err.message },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Get('findOneByJobId/:jobId')
  @HttpCode(HttpStatus.OK)
  async findOneByJobId(@Param('jobId') jobId: string) {
    try {
      const job = await this.jobService.findOneByJobId(+jobId);
      console.log(job);
      return { success: true, data: job };
    } catch (err) {
      throw new HttpException(
        { success: false, message: err.message },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Get('findTotalJobsByCompanyId/:id')
  @HttpCode(HttpStatus.OK)
  async findTotalJobsByCompanyId(@Param('id') id: string) {
    try {
      const job = await this.jobService.findTotalJobsByCompanyId(+id);
      return { success: true, data: job };
    } catch (err) {
      throw new HttpException(
        { success: false, message: err.message },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Patch('updateJobStatus/:jobId')
  @HttpCode(HttpStatus.OK)
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string' },
      },
    },
  })
  async updateJobStatus(
    @Param('jobId') jobId: string,
    @Body('status') status: string,
  ) {
    try {
      const job = await this.jobService.updateJobStatus(+jobId, status);
      return { success: true, data: job };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }

  @Get('findActiveJobsByCompanyId/:id')
  @HttpCode(HttpStatus.OK)
  async findActiveJobsByCompanyId(@Param('id') id: string) {
    try {
      const job = await this.jobService.findActiveJobsByCompanyId(+id);
      return { success: true, data: job };
    } catch (err) {
      throw new HttpException(
        { success: false, message: err.message },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Get('findJobsCountInAllMonthsByCompanyId/:id')
  @HttpCode(HttpStatus.OK)
  async findJobsInAMonthByCompanyId(@Param('id') id: string) {
    try {
      const job =
        await this.jobService.findJobsCountInAllMonthsByCompanyId(+id);
      return { success: true, data: job };
    } catch (err) {
      throw new HttpException(
        { success: false, message: err.message },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Get('findApplicationsCountInAllMonthsByCompanyId/:companyId')
  @HttpCode(HttpStatus.OK)
  async findApplicationsCountInAllMonthsByCompanyId(
    @Param('companyId') companyId: string,
  ) {
    try {
      const job =
        await this.jobService.findApplicationsCountInAllMonthsByCompanyId(
          +companyId,
        );
      return { success: true, data: job };
    } catch (err) {
      throw new HttpException(
        { success: false, message: err.message },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Get('findApplicationsInLastFiveJobsByCompanyId/:companyId')
  @HttpCode(HttpStatus.OK)
  async findApplicationsInLastFiveJobsByCompanyId(
    @Param('companyId') companyId: string,
  ) {
    try {
      const job =
        await this.jobService.findApplicationsInLastFiveJobsByCompanyId(
          +companyId,
        );
      return { success: true, data: job };
    } catch (err) {
      throw new HttpException(
        { success: false, message: err.message },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Patch('updateJobById:id')
  update(@Param('id') id: string, @Body() updateJobDto: UpdateJobDto) {
    return this.jobService.update(+id, updateJobDto);
  }

  @Delete('deleteJobById:id')
  @HttpCode(HttpStatus.ACCEPTED)
  async remove(@Param('id') id: string) {
    try {
      const job = await this.jobService.remove(+id);
      return { success: true, data: job };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }
}
