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
} from '@nestjs/common';
import { JobService } from './job.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('Job')
@Controller('job')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Post('/createJob/:recruiterId/:companyId')
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
  async findAll() {
    try {
      const jobs = await this.jobService.findAllJobs();
      return { success: true, data: jobs };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }

  @Get('findOneByCompanyId/:id')
  async findOne(@Param('id') id: string) {
    try {
      const job = await this.jobService.findOneByCompanyId(+id);
      console.log(job);
      return { success: true, data: job };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }

  @Get('findOneByJobId/:jobId')
  async findOneByJobId(@Param('jobId') jobId: string) {
    try {
      const job = await this.jobService.findOneByJobId(+jobId);
      console.log(job);
      return { success: true, data: job };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }

  @Get('findTotalJobsByCompanyId/:id')
  async findTotalJobsByCompanyId(@Param('id') id: string) {
    try {
      const job = await this.jobService.findTotalJobsByCompanyId(+id);
      return { success: true, data: job };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }

  @Get('findActiveJobsByCompanyId/:id')
  async findActiveJobsByCompanyId(@Param('id') id: string) {
    try {
      const job = await this.jobService.findActiveJobsByCompanyId(+id);
      return { success: true, data: job };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }

  @Get('findJobsInAMonthByCompanyId/:id')
  async findJobsInAMonthByCompanyId(@Param('id') id: string) {
    try {
      const job =
        await this.jobService.findJobsCountInAllMonthsByCompanyId(+id);
      return { success: true, data: job };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }

  @Patch('updateJobById:id')
  update(@Param('id') id: string, @Body() updateJobDto: UpdateJobDto) {
    return this.jobService.update(+id, updateJobDto);
  }

  @Delete('deleteJobById:id')
  async remove(@Param('id') id: string) {
    try {
      const job = await this.jobService.remove(+id);
      return { success: true, data: job };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }
}
