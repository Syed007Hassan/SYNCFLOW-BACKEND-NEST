import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateWorkFlowDto } from './dto/create-workflow.dto';
import { UpdateWorkflowDto } from './dto/update-workflow.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { WorkFlow } from './entities/workflow.entity';
import { Repository, In } from 'typeorm';
import { Job } from '../job/entities/job.entity';
import { Stage } from './entities/stage.entity';
import { StageAssignee } from './entities/stageAssignee';
import { AssignStageDto } from './dto/stage-assign.dto';
import { UpdateStageDto } from './dto/update-stage.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
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
    @Inject(CACHE_MANAGER) private cacheService: Cache,
  ) {}

  async createWorkFlow(jobId: number, createWorkFlowDto: CreateWorkFlowDto) {
    const job = await this.jobRepo.findOne({
      where: { jobId: jobId },
    });

    if (!job) {
      throw new Error('Job not found');
    }

    const ifExistingWorkflow = await this.workflowRepo.findOne({
      where: { job: { jobId: jobId } },
    });

    if (ifExistingWorkflow) {
      throw new Error('Workflow already exists for jobId: ' + jobId);
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

    // invalidate cache
    await this.cacheService.del(`workflows_by_job_${jobId}`); // delete cache
    await this.cacheService.del(`all_workflows`); // delete cache
    await this.cacheService.del(`workflow_${savedWorkflow.workflowId}`); // delete cache

    return createdWorkflow;
  }

  async assignStage(
    workflowId: number,
    stageId: number,
    assignStageDto: AssignStageDto,
  ) {
    // invalidate cache
    await this.cacheService.del(`assigned_stage_${workflowId}_${stageId}`); // delete cache

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
    // create a cache key:
    const cacheKey = `assigned_stage_${workflowId}_${stageId}`;

    // check if data is in cache:
    const cachedData = await this.cacheService.get<any>(cacheKey);
    if (cachedData) {
      return cachedData;
    }

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

    // set the cache:
    await this.cacheService.set(cacheKey, assignedStage);
    return assignedStage;
  }

  async findAll() {
    // create a cache key:
    const cacheKey = `all_workflows`;

    // check if data is in cache:
    const cachedData = await this.cacheService.get<any>(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    // if not, fetch data from the database:
    const allWorkflows = await this.workflowRepo.find({
      relations: ['job', 'stages'],
    });

    if (allWorkflows.length === 0) {
      throw new Error('No workflows found');
    }

    // set the cache:
    await this.cacheService.set(cacheKey, allWorkflows);
    return allWorkflows;
  }

  async findWorkFlowById(workflowId: number) {
    // create a cache key:
    const cacheKey = `workflow_${workflowId}`;

    // check if data is in cache:
    const cachedData = await this.cacheService.get<any>(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    // if not, fetch data from the database:
    const workflow = await this.workflowRepo.findOne({
      relations: ['job', 'stages', 'stages.assignees'],
      where: { workflowId: workflowId },
    });

    if (!workflow) {
      throw new Error('Workflow not found');
    }

    // set the cache:
    await this.cacheService.set(cacheKey, workflow);
    return workflow;
  }

  async findOneByJobId(id: number) {
    // create a cache key:
    const cacheKey = `workflows_by_job_${id}`;

    // check if data is in cache:
    const cachedData = await this.cacheService.get<any>(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    // if not, fetch data from the database:
    const allWorkflows = await this.workflowRepo.find({
      relations: ['job', 'stages'],
      where: { job: { jobId: id } },
    });

    if (allWorkflows.length === 0) {
      throw new Error('No workflows found for this job');
    }

    // set the cache:
    await this.cacheService.set(cacheKey, allWorkflows);
    return allWorkflows;
  }

  async updateWorkflowStage(
    workflowId: number,
    stageId: number,
    updateStageDto: UpdateStageDto,
  ) {
    // invalidate cache
    await this.cacheService.del(`assigned_stage_${workflowId}_${stageId}`); // delete cache
    await this.cacheService.del(`workflow_${workflowId}`); // delete cache

    const existingWorkflow = await this.workflowRepo.findOne({
      where: { workflowId: workflowId },
    });

    if (!existingWorkflow) {
      throw new NotFoundException('Workflow not found with ' + workflowId);
    }

    const stage = await this.stageRepo.findOne({
      where: { stageId: stageId, workflow: { workflowId: workflowId } },
      relations: ['workflow'],
    });

    if (stage == null) {
      throw new NotFoundException('Stage not found with ' + stageId);
    }

    const updatedStage = await this.stageRepo.merge(stage, updateStageDto);
    await this.stageRepo.save(updatedStage);
    return updatedStage;
  }

  async removeStage(workflowId: number, stageId: number) {
    // invalidate cache
    await this.cacheService.del(`assigned_stage_${workflowId}_${stageId}`); // delete cache
    await this.cacheService.del(`workflow_${workflowId}`); // delete cache

    const existingWorkflow = await this.workflowRepo.findOne({
      where: { workflowId: workflowId },
    });

    if (!existingWorkflow) {
      throw new NotFoundException('Workflow not found with ' + workflowId);
    }

    const stage = await this.stageRepo.findOne({
      where: { stageId: stageId, workflow: { workflowId: workflowId } },
      relations: ['workflow'],
    });

    if (stage == null) {
      throw new NotFoundException('Stage not found with ' + stageId);
    }

    await this.stageRepo.remove(stage);

    return stage;
  }

  async removeWorkflow(workflowId: number) {
    // invalidate cache
    await this.cacheService.del(`workflow_${workflowId}`); // delete cache

    const existingWorkflow = await this.workflowRepo.findOne({
      where: { workflowId: workflowId },
      relations: ['job']
    });

    await this.cacheService.del(
      `workflows_by_job_${existingWorkflow.job.jobId}`,
    ); // delete cache

    if (!existingWorkflow) {
      throw new NotFoundException('Workflow not found with ' + workflowId);
    }

    await this.workflowRepo.remove(existingWorkflow);

    return existingWorkflow;
  }
}
