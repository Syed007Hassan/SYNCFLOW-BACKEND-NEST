import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Job } from './job.entity';

@Entity()
export class Interview {
  @PrimaryGeneratedColumn()
  interviewId: number;

  @Column()
  interviewName: string;

  @Column()
  interviewDesc: string;

  @Column()
  interviewDuration: number;

  @Column()
  interviewStatus: string;

  @ManyToOne(() => Job, (job) => job.interviews)
  @JoinColumn({ name: 'jobId' })
  job: Job;
}
