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
// import { Stage } from '../dto/stage.interface';
import { Job } from '../../job/entities/job.entity';
import { Stage } from './stage.entity';

@Entity('workflow')
export class WorkFlow {
  @Index()
  @PrimaryGeneratedColumn()
  workflowId: number;

  @OneToMany(() => Stage, (stage) => stage.workflow, { cascade: true })
  stages: Stage[];

  @OneToOne((type) => Job, (job) => job.workflow)
  @JoinColumn({ name: 'jobId' })
  job: Job;
}
