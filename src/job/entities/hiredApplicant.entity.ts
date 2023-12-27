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

import { Job } from './job.entity';
import { Application } from '../../application/entities/application.entity';
import { Applicant } from 'src/user/entities/user.entity';
import { Company } from 'src/company/entities/company.entity';

@Entity('hiredApplicant')
export class HiredApplicant {
  @Index()
  @PrimaryGeneratedColumn()
  hiredApplicantId: number;

  @Column({ nullable: true })
  hiredApplicantStatus: string;

  @Column({ nullable: true })
  hiredApplicantCreatedAt: Date;

  @Column({ nullable: true })
  hiredApplicantPackage: string;

  @ManyToOne((type) => Job, (job) => job.hiredApplicants)
  @JoinColumn({ name: 'jobId' })
  job: Job;

  @Column({ nullable: true })
  jobId: number;

  @OneToOne(() => Applicant, (applicant) => applicant.hiredApplicant)
  @JoinColumn({ name: 'id' })
  applicant: Applicant;

  @Column({ nullable: true })
  id: number;

  @ManyToOne(() => Company, (company) => company.hiredApplicants)
  @JoinColumn({ name: 'companyId' })
  company: Company;

  @Column({ nullable: true })
  companyId: number;
}
