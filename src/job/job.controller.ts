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
import { CreateWorkFlowDto } from './dto/create-workflow.dto';
@ApiTags('Job')
@Controller('job')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Post('/create')
  async create(@Body() createJobDto: CreateJobDto) {
    try {
      const job = await this.jobService.create(createJobDto);
      return { success: true, data: job };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }

  @Post('/createWorkFlow')
  async createWorkFlow(@Body() createWorkFlowDto: CreateWorkFlowDto) {
    try {
      const workflow = await this.jobService.createWorkFlow(createWorkFlowDto);
      return { success: true, data: workflow };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }

  @Get('findAll')
  findAll() {
    return this.jobService.findAll();
  }

  @Get('findOne/:id')
  findOne(@Param('id') id: string) {
    return this.jobService.findOne(+id);
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
