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

@Entity('assessment')
export class Assessment {
  @Index()
  @PrimaryGeneratedColumn()
  assessmentId: number;

  @Column({ nullable: true })
  assessmentName: string;

  @Column({ nullable: true })
  assessmentDescription: string;

  @Column({ nullable: true })
  assessmentType: string;

  @Column({ nullable: true })
  assessmentDuration: string;

  @Column({ nullable: true })
  assessmentStatus: string;

  @Column({ nullable: true })
  assessmentCreatedAt: Date;

  @ManyToOne((type) => Job, (job) => job.assessments)
  @JoinColumn({ name: 'jobId' })
  job: Job;

  @BeforeInsert()
  setCreatedAt() {
    this.assessmentCreatedAt = new Date();
  }
}
