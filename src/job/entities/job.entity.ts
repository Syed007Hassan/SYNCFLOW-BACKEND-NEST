import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
  Index,
  OneToOne,
} from 'typeorm';
import { Company } from '../../company/entities/company.entity';
import { Application } from '../../application/entities/application.entity';
import { WorkFlow } from '../../workflow/entities/workflow.entity';
import { AppliedJob } from './appliedJob.entity';
import { Assessment } from './assessment.entity';
import { Recruiter } from '../../employer/entities/employer.entity';
import { HiredApplicant } from './hiredApplicant.entity';
import { Interview } from './interview.entity';
import { JobLocation } from '../dto/jobLocation.interface';
@Entity('job')
export class Job {
  @Index()
  @PrimaryGeneratedColumn()
  jobId: number;

  @Column({ nullable: true })
  jobTitle: string;

  @Column({ nullable: true })
  jobDescription: string;

  @Column({ nullable: true })
  jobType: string;

  @Column({ nullable: true })
  jobCategory: string;

  @Column({ nullable: true, type: 'jsonb' })
  jobLocation: JobLocation;

  @Column({ nullable: true })
  jobSalary: string;

  @Column({ nullable: true })
  jobStatus: string;

  @Column({ nullable: true })
  jobQualification: string;

  @Column({ nullable: true })
  jobUrgency: string;

  @Column({ nullable: true })
  jobExperience: string;

  @Column({ nullable: true, type: 'jsonb' })
  jobSkills: string[];

  @Column({ nullable: true })
  restrictedLocationRange: string;

  @Column({ nullable: true })
  jobCreatedAt: Date;

  @ManyToOne((type) => Company, (company) => company.jobs)
  @JoinColumn({ name: 'companyId' })
  company: Company;

  @OneToMany(() => Application, (application) => application.job)
  applications: Application[];

  @OneToOne(() => WorkFlow, (workflow) => workflow.job)
  workflow: WorkFlow;

  @OneToMany(() => AppliedJob, (appliedJob) => appliedJob.job)
  appliedJobs: AppliedJob[];

  @OneToMany(() => Assessment, (assessment) => assessment.job)
  assessments: Assessment[];

  @ManyToOne(() => Recruiter, (recruiter) => recruiter.jobs)
  @JoinColumn({ name: 'recruiterId' })
  recruiter: Recruiter;

  @OneToMany(() => HiredApplicant, (hiredApplicant) => hiredApplicant.job)
  hiredApplicants: HiredApplicant[];

  @OneToMany(() => Interview, (interview) => interview.job)
  interviews: Interview[];

  @BeforeInsert()
  async setJobCreatedAt() {
    this.jobCreatedAt = new Date();
  }
}
