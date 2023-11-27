import { Injectable } from '@nestjs/common';
import { CreateWorkFlowDto } from './dto/create-workflow.dto';
import { UpdateWorkflowDto } from './dto/update-workflow.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { WorkFlow } from './entities/workflow.entity';
import { Repository } from 'typeorm';
import { Job } from '../job/entities/job.entity';

@Injectable()
export class WorkflowService {
  constructor(
    @InjectRepository(WorkFlow)
    public readonly workflowRepo: Repository<WorkFlow>,
  ) {}

  async createWorkFlow(createWorkFlowDto) {
    const newJob = await this.workflowRepo.create(createWorkFlowDto);
    return await this.workflowRepo.save(newJob);
  }

  async findAll() {
    const allWorkflows = await this.workflowRepo.find();

    if (allWorkflows.length === 0) {
      throw new Error('No workflows found');
    }
    return allWorkflows;
  }

  async findOneByJobId(id: number) {
    const allWorkflows = await this.workflowRepo.find({
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
