import { UpdateJobDto } from './dto/update-job.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Job } from './entities/job.entity';
import { CreateJobDto } from './dto/create-job.dto';
import { Company } from 'src/company/entities/company.entity';
import { Recruiter } from 'src/employer/entities/employer.entity';

@Injectable()
export class JobService {
  constructor(
    @InjectRepository(Job)
    public readonly jobRepo: Repository<Job>,
    @InjectRepository(Company)
    public readonly companyRepo: Repository<Company>,
    @InjectRepository(Recruiter)
    public readonly recruiterRepo: Repository<Recruiter>,
    @Inject(CACHE_MANAGER) private cacheService: Cache,
  ) {}

  async create(
    recruiterId: number,
    companyId: number,
    createJobDto: CreateJobDto,
  ) {
    const company = await this.companyRepo.findOne({
      where: { companyId: companyId },
    });

    const recruiter = await this.recruiterRepo.findOne({
      where: { recruiterId: recruiterId },
    });

    if (!company || !recruiter) {
      throw new Error('Company or Recruiter not found');
    }

    const newJob = await this.jobRepo.create({
      ...createJobDto,
      company: company,
      recruiter: recruiter,
    });

    return await this.jobRepo.save(newJob);
  }

  async findAllJobs() {
    // create a cache key:
    const cacheKey = `all_jobs`;

    // check if data is in cache:
    const cachedData = await this.cacheService.get<any>(cacheKey);
    if (cachedData) {
      console.log(`Getting data from cache!`);
      return cachedData;
    }

    // if not, fetch data from the database:
    const allJobs = await this.jobRepo.find({
      relations: ['company', 'recruiter'],
    });

    if (allJobs.length === 0) {
      throw new Error('No jobs found');
    }

    // set the cache:
    await this.cacheService.set(cacheKey, allJobs);
    return allJobs;
  }

  async findOneByCompanyId(id: number) {
    const allJobs = await this.jobRepo.find({
      relations: ['company'],
      where: { company: { companyId: id } },
    });

    if (allJobs.length === 0) {
      throw new Error('No jobs found');
    }
    return allJobs;
  }

  async findOneByJobId(id: number) {
    const job = await this.jobRepo.findOne({
      relations: ['company', 'recruiter'],
      where: { jobId: id },
    });

    if (!job) {
      throw new Error('No job found');
    }
    return job;
  }

  async findTotalJobsByCompanyId(id: number) {
    const totalJobs = await this.jobRepo.count({
      where: { company: { companyId: id } },
    });

    if (totalJobs === 0) {
      throw new Error('No jobs found');
    }
    return totalJobs;
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
