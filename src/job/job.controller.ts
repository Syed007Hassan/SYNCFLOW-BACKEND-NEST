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
      const jobs = await this.jobService.findAll();
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

  @Patch('updateJobById:id')
  update(@Param('id') id: string, @Body() updateJobDto: UpdateJobDto) {
    return this.jobService.update(+id, updateJobDto);
  }

  @Delete('deleteJobById:id')
  remove(@Param('id') id: string) {
    return this.jobService.remove(+id);
  }
}
