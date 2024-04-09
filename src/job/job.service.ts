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
import { Application } from 'src/application/entities/application.entity';
import { getMonth, getYear, getDate } from 'date-fns';

@Injectable()
export class JobService {
  constructor(
    @InjectRepository(Job)
    public readonly jobRepo: Repository<Job>,
    @InjectRepository(Company)
    public readonly companyRepo: Repository<Company>,
    @InjectRepository(Recruiter)
    public readonly recruiterRepo: Repository<Recruiter>,
    @InjectRepository(Application)
    public readonly applicationRepo: Repository<Application>,
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

    // Invalidate the cache
    await this.cacheService.del(`all_jobs`);
    await this.cacheService.del(`jobs_by_company_${companyId}`);
    await this.cacheService.del(`total_jobs_by_company_${companyId}`);
    await this.cacheService.del(`active_jobs_by_company_${companyId}`);
    await this.cacheService.del(`job_counts_by_month_company_${companyId}`);
    await this.cacheService.del(
      `application_counts_by_month_company_${companyId}`,
    );
    await this.cacheService.del(
      `applications_in_last_five_jobs_by_company_${companyId}`,
    );

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
    // create a cache key:
    const cacheKey = `jobs_by_company_${id}`;

    // check if data is in cache:
    const cachedData = await this.cacheService.get<any>(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    // if not, fetch data from the database:
    const allJobs = await this.jobRepo.find({
      relations: ['company'],
      where: { company: { companyId: id } },
    });

    if (allJobs.length === 0) {
      throw new Error('No jobs found');
    }

    // set the cache:
    await this.cacheService.set(cacheKey, allJobs);
    return allJobs;
  }

  async findOneByJobId(id: number) {
    // create a cache key:
    const cacheKey = `job_${id}`;

    // check if data is in cache:
    const cachedData = await this.cacheService.get<any>(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    // if not, fetch data from the database:
    const job = await this.jobRepo.findOne({
      relations: ['company', 'recruiter'],
      where: { jobId: id },
    });

    if (!job) {
      throw new Error('No job found');
    }

    // set the cache:
    await this.cacheService.set(cacheKey, job);
    return job;
  }

  async findTotalJobsByCompanyId(id: number) {
    // create a cache key:
    const cacheKey = `total_jobs_by_company_${id}`;

    // check if data is in cache:
    const cachedData = await this.cacheService.get<any>(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    // if not, fetch data from the database:
    const totalJobs = await this.jobRepo.count({
      where: { company: { companyId: id } },
    });

    if (totalJobs === 0) {
      throw new Error('No jobs found');
    }

    // set the cache:
    await this.cacheService.set(cacheKey, totalJobs);
    return totalJobs;
  }

  async updateJobStatus(jobId: number, status: string) {
    const job = await this.jobRepo.findOne({
      where: { jobId: jobId },
    });

    if (!job) {
      throw new Error('Job not found');
    }

    job.jobStatus = status;

    // Invalidate the cache
    await this.cacheService.del(`all_jobs`);
    await this.cacheService.del(`jobs_by_company_${job.company.companyId}`);
    await this.cacheService.del(
      `total_jobs_by_company_${job.company.companyId}`,
    );
    await this.cacheService.del(
      `active_jobs_by_company_${job.company.companyId}`,
    );
    await this.cacheService.del(
      `job_counts_by_month_company_${job.company.companyId}`,
    );
    await this.cacheService.del(`job_${jobId}`);
    await this.cacheService.del(
      `application_counts_by_month_company_${job.company.companyId}`,
    );
    await this.cacheService.del(
      `applications_in_last_five_jobs_by_company_${job.company.companyId}`,
    );

    return await this.jobRepo.save(job);
  }

  async findActiveJobsByCompanyId(id: number) {
    // create a cache key:
    const cacheKey = `active_jobs_by_company_${id}`;

    // check if data is in cache:
    const cachedData = await this.cacheService.get<any>(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    // if not, fetch data from the database:
    const activeJobs = await this.jobRepo.count({
      where: { company: { companyId: id }, jobStatus: 'active' },
    });

    if (activeJobs === 0) {
      throw new Error('No active jobs found');
    }

    // set the cache:
    await this.cacheService.set(cacheKey, activeJobs);
    return activeJobs;
  }

  async findJobsCountInAllMonthsByCompanyId(id: number) {
    // create a cache key:
    const cacheKey = `job_counts_by_month_company_${id}`;

    // check if data is in cache:
    const cachedData = await this.cacheService.get<any>(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    // if not, fetch data from the database:
    const jobs = await this.jobRepo.find({
      where: { company: { companyId: id } },
    });

    const jobCountsByMonth = jobs.reduce((acc, job) => {
      const date = new Date(job.jobCreatedAt);
      const year = date.getFullYear();
      const month = date.getMonth() + 1; // getMonth() returns month index starting from 0

      const key = `${year}-${month < 10 ? '0' + month : month}`; // key format: YYYY-MM

      if (!acc[key]) {
        acc[key] = 0;
      }

      acc[key]++;

      return acc;
    }, {});

    // set the cache:
    await this.cacheService.set(cacheKey, jobCountsByMonth);
    return jobCountsByMonth;
  }

  async findApplicationsCountInAllMonthsByCompanyId(companyId: number) {
    // create a cache key:
    const cacheKey = `application_counts_by_month_company_${companyId}`;

    // check if data is in cache:
    const cachedData = await this.cacheService.get<any>(cacheKey);
    if (cachedData) {
      console.log(`Getting data from cache!`);
      return cachedData;
    }

    // if not, fetch data from the database:
    const applications = await this.applicationRepo.find({
      where: { job: { company: { companyId: companyId } } },
    });

    if (applications.length === 0) {
      throw new Error('No applications found');
    }

    const applicationCountsByMonth = applications.reduce((acc, application) => {
      const date = new Date(application.applicationDate);
      const year = date.getFullYear();
      const month = date.getMonth() + 1; // getMonth() returns month index starting from 0

      const key = `${year}-${month < 10 ? '0' + month : month}`; // key format: YYYY-MM

      if (!acc[key]) {
        acc[key] = 0;
      }

      acc[key]++;

      return acc;
    }, {});

    // set the cache:
    await this.cacheService.set(cacheKey, applicationCountsByMonth);
    return applicationCountsByMonth;
  }

  async findApplicationsInLastFiveJobsByCompanyId(companyId: number) {
    // create a cache key:
    const cacheKey = `applications_in_last_five_jobs_by_company_${companyId}`;

    // check if data is in cache:
    const cachedData = await this.cacheService.get<any>(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    // if not, fetch data from the database:
    const jobs = await this.jobRepo.find({
      where: { company: { companyId: companyId } },
      order: { jobId: 'DESC' },
      take: 5,
    });

    if (jobs.length === 0) {
      throw new Error('No jobs found');
    }

    const applications = await Promise.all(
      jobs.map(async (job) => {
        const applications = await this.applicationRepo.find({
          where: { job: { jobId: job.jobId } },
        });

        return {
          jobId: job.jobId,
          jobTitle: job.jobTitle,
          applications: applications.length,
        };
      }),
    );

    // set the cache:
    await this.cacheService.set(cacheKey, applications);
    return applications;
  }

  findOne(id: number) {
    return `This action returns a #${id} job`;
  }

  update(id: number, updateJobDto: UpdateJobDto) {
    return `This action updates a #${id} job`;
  }

  async remove(id: number) {
    const job = await this.jobRepo.findOne({
      where: { jobId: id },
    });

    if (!job) {
      throw new Error('Job not found');
    }

    return await this.jobRepo.remove(job);
  }
}
