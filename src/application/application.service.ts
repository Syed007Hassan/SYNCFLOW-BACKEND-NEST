import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Application } from './entities/application.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Job } from 'src/job/entities/job.entity';
import { Applicant } from 'src/user/entities/user.entity';

@Injectable()
export class ApplicationService {
  constructor(
    @InjectRepository(Application)
    public readonly applicationRepo: Repository<Application>,
    @InjectRepository(Job)
    public readonly jobRepo: Repository<Job>,
    @InjectRepository(Applicant)
    public readonly applicantRepo: Repository<Applicant>,
    @Inject(CACHE_MANAGER) private cacheService: Cache,
  ) {}

  async create(
    jobId: number,
    applicantId: number,
    createApplicationDto: CreateApplicationDto,
  ) {
    const job = await this.jobRepo.findOne({
      where: { jobId: jobId },
    });

    const applicant = await this.applicantRepo.findOne({
      where: { id: applicantId },
    });

    const existingApplication = await this.applicationRepo.findOne({
      where: { job: { jobId: jobId }, applicant: { id: applicantId } },
    });

    if (existingApplication) {
      throw new Error('Application already exists');
    }

    if (!job || !applicant) {
      throw new Error('Job or Applicant not found');
    }

    const newApplication = await this.applicationRepo.create({
      ...createApplicationDto,
      job: job,
      applicant: applicant,
    });

    return await this.applicationRepo.save(newApplication);
  }

  findAll() {
    return `This action returns all application`;
  }

  async findByJobId(jobId: number) {
    const applications = await this.applicationRepo.find({
      where: { job: { jobId: jobId } },
      relations: ['applicant', 'job', 'applicant.applicantDetails'],
    });

    //delete the password from the response
    applications.forEach((application) => {
      delete application.applicant.password;
    });

    if (!applications) {
      throw new Error('No applications found');
    }

    return applications;
  }

  update(id: number, updateApplicationDto: UpdateApplicationDto) {
    return `This action updates a #${id} application`;
  }

  remove(id: number) {
    return `This action removes a #${id} application`;
  }
}
