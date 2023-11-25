import { UpdateJobDto } from './dto/update-job.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Job } from './entities/job.entity';
import { WorkFlow } from './entities/workflow.entity';
import { CreateJobDto } from './dto/create-job.dto';

@Injectable()
export class JobService {
  constructor(
    @InjectRepository(Job)
    public readonly jobRepo: Repository<Job>,
    @InjectRepository(WorkFlow)
    public readonly workflowRepo: Repository<WorkFlow>,
    @Inject(CACHE_MANAGER) private cacheService: Cache,
  ) {}

  async create(createJobDto) {
    const newJob = await this.jobRepo.create(createJobDto);
    return await this.jobRepo.save(newJob);
  }

  async createWorkFlow(createWorkFlowDto) {
    const newJob = await this.workflowRepo.create(createWorkFlowDto);
    return await this.workflowRepo.save(newJob);
  }

  findAll() {
    return `This action returns all job`;
  }

  findOne(id: number) {
    return `This action returns a #${id} job`;
  }

  update(id: number, updateJobDto: UpdateJobDto) {
    return `This action updates a #${id} job`;
  }

  remove(id: number) {
    return `This action removes a #${id} job`;
  }
}
