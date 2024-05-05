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
import { WorkflowService } from './workflow.service';
import { CreateWorkFlowDto } from './dto/create-workflow.dto';
import { UpdateWorkflowDto } from './dto/update-workflow.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AssignStageDto } from './dto/stage-assign.dto';
import { UpdateStageDto } from './dto/update-stage.dto';
import { HasRoles } from 'src/auth/decorators/has-roles.decorator';
import { Role } from 'src/auth/model/role.enum';
import { JwtGuard } from 'src/auth/guards/jwt-auth.guard';
import { RoleGuard } from 'src/auth/guards/role-auth.guard';

@ApiTags('Workflow')
@Controller('workflow')
export class WorkflowController {
  constructor(private readonly workflowService: WorkflowService) {}

  @ApiBearerAuth()
  @HasRoles(Role.Employer)
  @UseGuards(JwtGuard, RoleGuard)
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

  @ApiBearerAuth()
  @HasRoles(Role.Employer)
  @UseGuards(JwtGuard, RoleGuard)
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

  @ApiBearerAuth()
  @HasRoles(Role.Employer)
  @UseGuards(JwtGuard, RoleGuard)
  @Patch('updateStage/:workflowId/:stageId')
  async updateStage(
    @Param('workflowId') workflowId: string,
    @Param('stageId') stageId: string,
    @Body() updateStageDto: UpdateStageDto,
  ) {
    try {
      const workflow = await this.workflowService.updateWorkflowStage(
        +workflowId,
        +stageId,
        updateStageDto,
      );
      return { success: true, data: workflow };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }

  @ApiBearerAuth()
  @HasRoles(Role.Employer)
  @UseGuards(JwtGuard, RoleGuard)
  @Delete('removeStage/:workflowId/:stageId')
  async removeStage(
    @Param('workflowId') workflowId: string,
    @Param('stageId') stageId: string,
  ) {
    try {
      const workflow = await this.workflowService.removeStage(
        +workflowId,
        +stageId,
      );
      return { success: true, data: workflow };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }

  @ApiBearerAuth()
  @HasRoles(Role.Employer)
  @UseGuards(JwtGuard, RoleGuard)
  @Delete('removeWorkflow/:workflowId')
  async removeWorkflow(@Param('workflowId') workflowId: string) {
    try {
      const workflow = await this.workflowService.removeWorkflow(+workflowId);
      return { success: true, data: workflow };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }
}
