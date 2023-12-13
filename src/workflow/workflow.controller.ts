import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { WorkflowService } from './workflow.service';
import { CreateWorkFlowDto } from './dto/create-workflow.dto';
import { UpdateWorkflowDto } from './dto/update-workflow.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Workflow')
@Controller('workflow')
export class WorkflowController {
  constructor(private readonly workflowService: WorkflowService) {}

  @Post('/createWorkFlow/:jobId')
  async createWorkFlow(
    @Param('jobId') jobId: string,
    @Body() createWorkFlowDto: CreateWorkFlowDto,
  ) {
    try {
      const workflow = await this.workflowService.createWorkFlow(
        +jobId,
        createWorkFlowDto,
      );
      return { success: true, data: workflow };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }

  @Get('findAll')
  async findAll() {
    try {
      const workflows = await this.workflowService.findAll();
      return { success: true, data: workflows };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }

  @Get('findByJobId/:id')
  async findOneByJobId(@Param('id') id: string) {
    try {
      const workflow = await this.workflowService.findOneByJobId(+id);
      return { success: true, data: workflow };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateWorkflowDto: UpdateWorkflowDto,
  ) {
    return this.workflowService.update(+id, updateWorkflowDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.workflowService.remove(+id);
  }
}
