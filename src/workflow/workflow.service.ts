import { Injectable } from '@nestjs/common';
import { CreateWorkFlowDto } from './dto/create-workflow.dto';
import { UpdateWorkflowDto } from './dto/update-workflow.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { WorkFlow } from './entities/workflow.entity';
import { Repository, In } from 'typeorm';
import { Job } from '../job/entities/job.entity';
import { Stage } from './entities/stage.entity';
import { StageAssignee } from './entities/stageAssignee';
import { AssignStageDto } from './dto/stage-assign.dto';
@Injectable()
export class WorkflowService {
  constructor(
    @InjectRepository(WorkFlow)
    public readonly workflowRepo: Repository<WorkFlow>,
    @InjectRepository(Job)
    public readonly jobRepo: Repository<Job>,
    @InjectRepository(Stage)
    public readonly stageRepo: Repository<Stage>,
    @InjectRepository(StageAssignee)
    public readonly stageAssigneeRepo: Repository<StageAssignee>,
  ) {}

  async createWorkFlow(jobId: number, createWorkFlowDto: CreateWorkFlowDto) {
    const job = await this.jobRepo.findOne({
      where: { jobId: jobId },
    });

    if (!job) {
      throw new Error('Job not found');
    }
    const newWorkflow = await this.workflowRepo.create({
      job: job,
    });

    const savedWorkflow = await this.workflowRepo.save(newWorkflow);

    if (!savedWorkflow) {
      throw new Error('Workflow not created');
    }

    const stages = createWorkFlowDto.stages.map((stage) => {
      return this.stageRepo.create({
        stageName: stage.stageName,
        category: stage.category,
        description: stage.description,
        workflow: savedWorkflow,
      });
    });

    const savedStages = await this.stageRepo.save(stages);

    if (!savedStages) {
      throw new Error('Stages not created');
    }

    const createdWorkflow = await this.workflowRepo.findOne({
      relations: ['stages', 'job'],
      where: { workflowId: savedWorkflow.workflowId },
    });

    return createdWorkflow;
  }

  async assignStage(
    workflowId: number,
    stageId: number,
    assignStageDto: AssignStageDto,
  ) {
    const existingWorkflow = await this.workflowRepo.findOne({
      where: { workflowId: workflowId },
    });

    if (!existingWorkflow) {
      throw new Error('Workflow not found');
    }

    const stage = await this.stageRepo.findOne({
      where: { stageId: stageId, workflow: { workflowId: workflowId } },
      relations: ['workflow'],
    });

    if (!stage) {
      throw new Error('Stage not found for this workflow');
    }

    let assignedStage = await this.stageAssigneeRepo.findOne({
      where: { stage: { stageId: stageId } },
    });

    if (assignedStage) {
      // If assignedStage already exists, update it
      console.log('assignedStage', assignedStage);
      assignedStage.assignees = assignStageDto.assignees;
    } else {
      // If assignedStage does not exist, create a new one
      assignedStage = this.stageAssigneeRepo.create({
        stage: stage,
        assignees: assignStageDto.assignees,
      });
    }

    return await this.stageAssigneeRepo.save(assignedStage);
  }

  async getAssignedStage(workflowId: number, stageId: number) {
    const existingWorkflow = await this.workflowRepo.findOne({
      where: { workflowId: workflowId },
    });

    if (!existingWorkflow) {
      throw new Error('Workflow not found for this job');
    }

    const stage = await this.stageRepo.findOne({
      where: { stageId: stageId, workflow: { workflowId: workflowId } },
      relations: ['workflow'],
    });

    if (!stage) {
      throw new Error('Stage not found for this workflow');
    }

    let assignedStage = await this.stageAssigneeRepo.findOne({
      where: { stage: { stageId: stageId } },
    });

    if (!assignedStage) {
      throw new Error('Stage Assignees not found for this stage');
    }

    return assignedStage;
  }

  async findAll() {
    const allWorkflows = await this.workflowRepo.find({
      relations: ['job', 'stages'],
    });

    if (allWorkflows.length === 0) {
      throw new Error('No workflows found');
    }
    return allWorkflows;
  }

  async findWorkFlowById(workflowId: number) {
    const workflow = await this.workflowRepo.findOne({
      relations: ['job', 'stages', 'stages.assignees'],
      where: { workflowId: workflowId },
    });

    if (!workflow) {
      throw new Error('Workflow not found');
    }
    return workflow;
  }

  async findOneByJobId(id: number) {
    const allWorkflows = await this.workflowRepo.find({
      relations: ['job', 'stages'],
      where: { job: { jobId: id } },
    });

    if (allWorkflows.length === 0) {
      throw new Error('No workflows found for this job');
    }
    return allWorkflows;
  }

  findOne(id: number) {
    return `This action returns a #${id} workflow`;
  }

  update(id: number, updateWorkflowDto: UpdateWorkflowDto) {
    return `This action updates a #${id} workflow`;
  }

  remove(id: number) {
    return `This action removes a #${id} workflow`;
  }
}
