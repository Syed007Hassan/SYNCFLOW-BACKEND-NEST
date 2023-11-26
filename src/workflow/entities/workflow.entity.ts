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
import { Stage } from '../dto/stage.interface';
import { Job } from '../../job/entities/job.entity';

@Entity('workflow')
export class WorkFlow {
  @Index()
  @PrimaryGeneratedColumn()
  workflowId: number;

  @Column({ nullable: true, type: 'jsonb' })
  stages: Stage[];

  @OneToOne((type) => Job, (job) => job.workflow)
  @JoinColumn({ name: 'jobId' })
  job: Job;

  @Column({ nullable: true })
  jobId: number;
}
