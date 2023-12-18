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

    // Map stages from DTO to Stage entities
    const stages = createWorkFlowDto.stages.map((stageDto) => {
      const stage = new Stage();
      stage.stageName = stageDto.stageName;
      stage.category = stageDto.category;
      return stage;
    });

    const newWorkflow = await this.workflowRepo.create({
      stages: stages,
      job: job,
    });

    return await this.workflowRepo.save(newWorkflow);
  }

  async assignStage(stageId: number, assignStageDto: AssignStageDto) {
    const stage = await this.stageRepo.findOne({
      where: { stageId: stageId },
    });

    if (!stage) {
      throw new Error('Stage not found');
    }

    const newAssignedStage = await this.stageAssigneeRepo.create({
      stage: stage,
      assignees: assignStageDto.assignees,
    });

    return await this.stageAssigneeRepo.save(newAssignedStage);
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
