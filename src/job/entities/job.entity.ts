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
import { WorkFlow } from './workflow.entity';
import { AppliedJob } from './appliedJob.entity';
import { Assessment } from './assessment.entity';
import { Recruiter } from '../../employer/entities/employer.entity';
import { HiredApplicant } from './hiredApplicant.entity';

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

  @Column({ nullable: true })
  jobLocation: string;

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

  @Column({ nullable: true })
  jobCreatedAt: Date;

  @ManyToOne((type) => Company, (company) => company.jobs)
  @JoinColumn({ name: 'companyId' })
  company: Company;

  @Column({ nullable: true })
  companyId: number;

  @OneToMany(() => Application, (application) => application.job)
  applications: Application[];

  @OneToOne(() => WorkFlow, (workflow) => workflow.job)
  @JoinColumn({ name: 'workflowId' })
  workflow: WorkFlow;

  @Column({ nullable: true })
  workflowId: number;

  @OneToMany(() => AppliedJob, (appliedJob) => appliedJob.job)
  appliedJobs: AppliedJob[];

  @OneToMany(() => Assessment, (assessment) => assessment.job)
  assessments: Assessment[];

  @OneToOne(() => Recruiter, (recruiter) => recruiter.job)
  @JoinColumn({ name: 'id' })
  recruiter: Recruiter;

  @Column({ nullable: true })
  id: number;

  @OneToMany(() => HiredApplicant, (hiredApplicant) => hiredApplicant.job)
  hiredApplicants: HiredApplicant[];

  @BeforeInsert()
  async setJobCreatedAt() {
    this.jobCreatedAt = new Date();
  }
}
