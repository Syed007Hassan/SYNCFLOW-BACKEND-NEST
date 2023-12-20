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
import { AssignStageDto } from './dto/stage-assign.dto';

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

  @Post('/assignStage/:workflowId/:stageId')
  async assignStage(
    @Param('stageId') stageId: string,
    @Param('workflowId') workflowId: string,
    @Body() assignStagesDto: AssignStageDto,
  ) {
    try {
      const stages = await this.workflowService.assignStage(
        +workflowId,
        +stageId,
        assignStagesDto,
      );
      return { success: true, data: stages };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }

  @Get('/findAssignedStage/:workflowId/:stageId')
  async getAssignedStage(
    @Param('stageId') stageId: string,
    @Param('workflowId') workflowId: string,
  ) {
    try {
      const stages = await this.workflowService.getAssignedStage(
        +workflowId,
        +stageId,
      );
      return { success: true, data: stages };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }

  @Get('findAllWorkflows')
  async findAll() {
    try {
      const workflows = await this.workflowService.findAll();
      return { success: true, data: workflows };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }

  @Get('findWorkflowById/:workflowId')
  async findWorkflowById(@Param('workflowId') workflowId: string) {
    try {
      const workflow = await this.workflowService.findWorkFlowById(+workflowId);
      return { success: true, data: workflow };
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
