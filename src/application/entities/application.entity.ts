import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Job } from '../../job/entities/job.entity';
import { Applicant } from '../../user/entities/user.entity';

@Entity()
export class Application {
  @PrimaryGeneratedColumn()
  applicationId: number;

  @Column({ nullable: false })
  status: string;

  @Column({
    nullable: false,
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  applicationDate: Date;

  @ManyToOne(() => Applicant, (applicant) => applicant.applications)
  @JoinColumn({ name: 'id' })
  applicant: Applicant;

  @Column({ nullable: true })
  id: number;

  @ManyToOne(() => Job, (job) => job.applications)
  @JoinColumn({ name: 'jobId' })
  job: Job;

  @Column({ nullable: true })
  jobId: number;

  @BeforeInsert()
  setApplicationDate() {
    this.applicationDate = new Date();
  }
}
