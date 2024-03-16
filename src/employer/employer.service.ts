import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateEmployerDto } from './dto/create-employer.dto';
import { UpdateEmployerDto } from './dto/update-employer.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Recruiter } from './entities/employer.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { CompanyService } from 'src/company/company.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { HttpService } from '@nestjs/axios';
import { Cache } from 'cache-manager';
import { Company } from 'src/company/entities/company.entity';
import { Job } from 'src/job/entities/job.entity';
import { WorkFlow } from 'src/workflow/entities/workflow.entity';
import { Stage } from 'src/workflow/entities/stage.entity';
import { StageAssignee } from 'src/workflow/entities/stageAssignee';

@Injectable()
export class EmployerService {
  constructor(
    @InjectRepository(Recruiter)
    private readonly employerRepo: Repository<Recruiter>,
    @InjectRepository(Company)
    private readonly companyRepo: Repository<Company>,
    private readonly companyService: CompanyService,
    @InjectRepository(Job)
    private readonly jobRepo: Repository<Job>,
    @InjectRepository(WorkFlow)
    private readonly workFlowRepo: Repository<WorkFlow>,
    @InjectRepository(Stage)
    private readonly stageRepo: Repository<Stage>,
    @InjectRepository(StageAssignee)
    private readonly stageAssigneeRepo: Repository<StageAssignee>,
    private readonly httpService: HttpService,
    @Inject(CACHE_MANAGER) private cacheService: Cache,
  ) {}

  async create(
    createUserDto: CreateEmployerDto,
    company: any,
  ): Promise<Recruiter> {
    const saltRounds = 10;
    const hash = bcrypt.hashSync(createUserDto.password, saltRounds);
    const newUser = await this.employerRepo.create({
      ...createUserDto,
      password: hash,
      company: company,
    });

    await this.employerRepo.save(newUser);

    return newUser;
  }

  async findAll() {
    // check if data is in cache:
    const cachedData = await this.cacheService.get<any>('all_recruiters');
    if (cachedData) {
      console.log(`Getting data from cache!`);
      return cachedData;
    }

    // if not, fetch data from the database:
    const employers = await this.employerRepo.find({
      relations: ['company'],
    });
    if (!employers) {
      throw new Error('No recruiters found');
    }

    // set the cache:
    await this.cacheService.set('all_recruiters', employers);
    return employers;
  }

  async findOneByEmail(email: string) {
    // create a cache key based on the email:
    const cacheKey = `recruiter_email_${email}`;

    // check if data is in cache:
    const cachedData = await this.cacheService.get<any>(cacheKey);
    if (cachedData) {
      console.log(`Getting data from cache!`);
      return cachedData;
    }

    // if not, fetch data from the database:
    const user = await this.employerRepo.findOne({
      where: { email },
      relations: ['company'],
    });
    if (!user) {
      return null;
    }

    // set the cache:
    await this.cacheService.set(cacheKey, user);
    return user;
  }

  async findEmployeeByCompanyName(companyName: string) {
    // create a cache key based on the company name:
    const cacheKey = `recruiter_${companyName}`;

    // check if data is in cache:
    const cachedData = await this.cacheService.get<any>(cacheKey);
    if (cachedData) {
      console.log(`Getting data from cache!`);
      return cachedData;
    }

    // if not, fetch data from the database:
    const company = await this.companyService.findOneByName(companyName);
    if (!company) {
      throw new Error('Company not found');
    }
    const employer = await this.employerRepo.find({
      relations: ['company'],
      where: { company: { companyId: company.companyId } },
    });

    if (!employer) {
      throw new Error('Employer not found');
    }

    // set the cache with the cache key:
    await this.cacheService.set(cacheKey, employer);
    return employer;
  }

  async findEmployeeByCompanyId(companyId: number) {
    // create a cache key based on the company id:
    const cacheKey = `recruiter_${companyId}`;

    // check if data is in cache:
    const cachedData = await this.cacheService.get<any>(cacheKey);
    if (cachedData) {
      console.log(`Getting data from cache!`);
      return cachedData;
    }

    // if not, fetch data from the database:
    const company = await this.companyRepo.findOne({
      where: { companyId },
    });
    if (!company) {
      throw new Error('Company not found');
    }
    const employer = await this.employerRepo.find({
      relations: ['company'],
      where: { company: { companyId: company.companyId } },
    });

    if (!employer) {
      throw new Error('Employer not found');
    }

    // set the cache with the cache key:
    await this.cacheService.set(cacheKey, employer);
    return employer;
  }

  async findOne(recruiterId: number) {
    // create a cache key based on the id:
    const cacheKey = `recruiter_id_${recruiterId}`;

    // check if data is in cache:
    const cachedData = await this.cacheService.get<any>(cacheKey);
    if (cachedData) {
      console.log(`Getting data from cache!`);
      return cachedData;
    }

    // if not, fetch data from the database:
    const user = await this.employerRepo.findOne({
      where: { recruiterId },
      relations: ['company'],
    });
    if (!user) {
      throw new Error('User not found');
    }

    // set the cache:
    await this.cacheService.set(cacheKey, user);
    return user;
  }

  async update(updateUserDto: UpdateEmployerDto) {
    const existingRecruiter = await this.employerRepo.findOneBy({
      email: updateUserDto.email,
    });

    console.log(existingRecruiter + 'existingRecruiter');

    if (!existingRecruiter) {
      throw new Error('User not found');
    }

    const saltRounds = 10;
    const hash = bcrypt.hashSync(updateUserDto.password, saltRounds);

    const updatedRecruiter = {
      ...existingRecruiter,
      ...updateUserDto,
      password: hash,
    };

    return await this.employerRepo.save(updatedRecruiter);
  }

  async findAllTheStagesAssignedToRecruiter(recruiterId: number) {
    // Find the recruiter
    const recruiter = await this.employerRepo.findOne({
      where: { recruiterId },
      relations: ['company'],
    });

    console.log(recruiter + 'hhhhh');
    if (!recruiter) {
      throw new NotFoundException(`Recruiter with ID ${recruiterId} not found`);
    }

    // Get the company ID
    const companyId = recruiter.company.companyId;

    // Find all jobs for the company
    const jobs = await this.jobRepo.find({
      where: { company: { companyId } },
      relations: ['workflow', 'workflow.stages', 'workflow.stages.assignees'],
    });

    if (!jobs) {
      throw new NotFoundException(`No jobs found for company ID ${companyId}`);
    }

    // Filter jobs where the recruiter is assigned
    const filteredJobs = jobs.filter((job) => {
      return (
        job.workflow &&
        job.workflow.stages &&
        job.workflow.stages.some((stage) => {
          return (
            stage.assignees &&
            stage.assignees.some((assignee) => {
              return (
                assignee.assignees &&
                assignee.assignees.some((a) => a.recruiterId === recruiterId)
              );
            })
          );
        })
      );
    });

    if (filteredJobs.length === 0) {
      throw new NotFoundException(
        `No jobs found for recruiter ID ${recruiterId}`,
      );
    }

    const result = filteredJobs.map((job) => {
      return {
        jobId: job.jobId,
        jobTitle: job.jobTitle,
        stages: job.workflow.stages
          .filter((stage) => {
            return (
              stage.assignees &&
              stage.assignees.some((assignee) => {
                return (
                  assignee.assignees &&
                  assignee.assignees.some((a) => a.recruiterId === recruiterId)
                );
              })
            );
          })
          .map((stage) => {
            return {
              stageId: stage.stageId,
              stageName: stage.stageName,
            };
          }),
      };
    });

    if (result.length === 0) {
      throw new NotFoundException(
        `No stages found for recruiter ID ${recruiterId}`,
      );
    }

    return result;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
