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
import { Applicant } from '../../user/entities/user.entity';

@Entity('appliedJob')
export class AppliedJob {
  @PrimaryGeneratedColumn()
  appliedJobId: number;

  @Column({ nullable: true })
  appliedJobStatus: string;

  @Column({ nullable: true })
  appliedJobCreatedAt: Date;

  @ManyToOne((type) => Job, (job) => job.appliedJobs)
  @JoinColumn({ name: 'jobId' })
  job: Job;

  @Column({ nullable: true })
  jobId: number;

  @ManyToOne((type) => Applicant, (applicant) => applicant.appliedJobs)
  @JoinColumn({ name: 'id' })
  applicant: Applicant;

  @Column({ nullable: true })
  id: number;

  @BeforeInsert()
  async createDates() {
    this.appliedJobCreatedAt = new Date();
  }
}
