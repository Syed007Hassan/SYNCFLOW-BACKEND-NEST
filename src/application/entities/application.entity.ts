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

  @ManyToOne(() => Job, (job) => job.applications)
  @JoinColumn({ name: 'job_id' })
  job: Job;

  @ManyToOne(() => Applicant, (applicant) => applicant.applications)
  @JoinColumn({ name: 'id' })
  applicant: Applicant;

  @Column({ nullable: true })
  id: number;

  @Column({ nullable: false })
  status: string;

  @Column({
    nullable: false,
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  applicationDate: Date;

  @BeforeInsert()
  setApplicationDate() {
    this.applicationDate = new Date();
  }
}
