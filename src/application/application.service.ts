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
import { WorkFlow } from 'src/workflow/entities/workflow.entity';
import { Stage } from 'src/workflow/entities/stage.entity';

@Injectable()
export class ApplicationService {
  constructor(
    @InjectRepository(Application)
    public readonly applicationRepo: Repository<Application>,
    @InjectRepository(Job)
    public readonly jobRepo: Repository<Job>,
    @InjectRepository(Applicant)
    public readonly applicantRepo: Repository<Applicant>,
    @InjectRepository(WorkFlow)
    public readonly workflowRepo: Repository<WorkFlow>,
    @InjectRepository(Stage)
    public readonly stageRepo: Repository<Stage>,
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

    const existingJobWorkflow = await this.workflowRepo.findOne({
      where: { job: { jobId: jobId } },
    });

    if (!existingJobWorkflow) {
      throw new Error('Workflow not found');
    }

    const existingFirstStageInWorkflow = await this.stageRepo.findOne({
      where: { workflow: { workflowId: existingJobWorkflow.workflowId } },
      order: { stageId: 'ASC' },
    });

    if (!existingFirstStageInWorkflow) {
      throw new Error('First stage not found');
    }

    const newApplication = await this.applicationRepo.create({
      ...createApplicationDto,
      job: job,
      applicant: applicant,
      stage: existingFirstStageInWorkflow,
    });

    await this.rateApplication(newApplication);

    // Invalidate the cache
    await this.cacheService.del(
      `application_counts_by_month_company_${job.company.companyId}`,
    );
    await this.cacheService.del(
      `applications_in_last_five_jobs_by_company_${job.company.companyId}`,
    );

    return await this.applicationRepo.save(newApplication);
  }

  async rateApplication(application: Application) {
    const applicant = await this.applicantRepo.findOne({
      where: { id: application.applicant.id },
      relations: ['applicantDetails'],
    });

    if (!applicant) {
      throw new Error('Applicant not found');
    }

    if (!applicant.applicantDetails) {
      throw new Error('Applicant details not found');
    }

    const applicantSkills = new Set(
      applicant.applicantDetails.skills.map((skill) => skill.toLowerCase()),
    );
    const jobSkills = new Set(
      application.job.jobSkills.map((skill) => skill.toLowerCase()),
    );

    if (applicantSkills.size === 0 || jobSkills.size === 0) {
      application.applicationRating = '0';
      await this.applicationRepo.save(application);
      return;
    }

    let matches = 0;

    for (let jobSkill of jobSkills) {
      for (let skill of applicantSkills) {
        if (skill.includes(jobSkill)) {
          matches++;
          break;
        }
      }
    }

    const percentage = Math.round((matches / jobSkills.size) * 100);
    application.applicationRating = percentage.toString();

    await this.applicationRepo.save(application);

    return percentage;
  }

  async findOne(applicationId: number) {
    const application = await this.applicationRepo.findOne({
      where: { applicationId: applicationId },
      relations: ['applicant'],
    });

    if (!application) {
      throw new Error('No application found');
    }

    //delete the password from the response
    delete application.applicant.password;

    return application;
  }

  async findAll() {
    const applications = await this.applicationRepo.find({
      relations: ['applicant', 'job', 'stage'],
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

  async findByJobId(jobId: number) {
    const applications = await this.applicationRepo.find({
      where: { job: { jobId: jobId } },
      relations: ['applicant', 'job', 'applicant.applicantDetails', 'stage'],
    });

    console.log(JSON.stringify(applications) + 'applications');

    if (applications.length === 0) {
      throw new Error('No applications found');
    }

    //delete the password from the response
    applications.forEach((application) => {
      delete application.applicant.password;
    });

    return applications;
  }

  async findByApplicantId(applicantId: number) {
    const applications = await this.applicationRepo.find({
      where: { applicant: { id: applicantId } },
      relations: ['applicant', 'job', 'stage'],
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

  async findByJobIdAndApplicantId(jobId: number, applicantId: number) {
    const application = await this.applicationRepo.findOne({
      where: { job: { jobId: jobId }, applicant: { id: applicantId } },
      relations: ['applicant', 'job', 'stage'],
    });

    //delete the password from the response
    delete application.applicant.password;

    if (!application) {
      throw new Error('No application found');
    }

    return application;
  }

  async updateApplication(jobId: number, applicantId: number, stageId: number) {
    const application = await this.applicationRepo.findOne({
      where: { job: { jobId: jobId }, applicant: { id: applicantId } },
      relations: ['applicant', 'job', 'stage'],
    });

    if (!application) {
      throw new Error('No application found');
    }

    const stage = await this.stageRepo.findOne({
      where: {
        stageId: stageId,
      },
      relations: ['workflow'],
    });

    if (!stage) {
      throw new Error('Stage not found for this workflow');
    }

    application.stage = stage;

    return await this.applicationRepo.save(application);
  }

  async updateApplicationFeedback(
    jobId: number,
    applicantId: number,
    applicationFeedback: string,
  ) {
    const application = await this.applicationRepo.findOne({
      where: { job: { jobId: jobId }, applicant: { id: applicantId } },
      relations: ['applicant', 'job', 'stage'],
    });

    if (!application) {
      throw new Error('No application found for this job and applicant');
    }

    application.applicationFeedback = applicationFeedback;

    return await this.applicationRepo.save(application);
  }

  async updateApplicationStatus(
    jobId: number,
    applicantId: number,
    status: string,
  ) {
    const application = await this.applicationRepo.findOne({
      where: { job: { jobId: jobId }, applicant: { id: applicantId } },
      relations: ['applicant', 'job', 'stage'],
    });

    if (!application) {
      throw new Error('No application found');
    }

    application.status = status;

    return await this.applicationRepo.save(application);
  }

  remove(id: number) {
    return `This action removes a #${id} application`;
  }
}
