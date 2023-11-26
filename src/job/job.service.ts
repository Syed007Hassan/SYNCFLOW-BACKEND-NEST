import { UpdateJobDto } from './dto/update-job.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Job } from './entities/job.entity';
import { CreateJobDto } from './dto/create-job.dto';

@Injectable()
export class JobService {
  constructor(
    @InjectRepository(Job)
    public readonly jobRepo: Repository<Job>,
    @Inject(CACHE_MANAGER) private cacheService: Cache,
  ) {}

  async create(createJobDto) {
    const newJob = await this.jobRepo.create(createJobDto);
    return await this.jobRepo.save(newJob);
  }

  async findAll() {
    const allJobs = await this.jobRepo.find();

    if (!allJobs) {
      throw new Error('No jobs found');
    } else {
      return allJobs;
    }
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
