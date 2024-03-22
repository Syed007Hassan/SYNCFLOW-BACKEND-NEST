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
import { Stage } from '../../workflow/entities/stage.entity';

@Entity()
export class Application {
  @PrimaryGeneratedColumn()
  applicationId: number;

  @Column({ nullable: false, default: 'pending' })
  status: string;

  @Column({ nullable: true })
  applicationFeedback: string;

  @Column({ nullable: true })
  applicationRating: string;

  @Column({
    nullable: false,
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  applicationDate: Date;

  @ManyToOne(() => Applicant, (applicant) => applicant.applications, {
    cascade: true,
  })
  @JoinColumn({ name: 'id' })
  applicant: Applicant;

  @ManyToOne(() => Job, (job) => job.applications, { cascade: true })
  @JoinColumn({ name: 'jobId' })
  job: Job;

  @ManyToOne(() => Stage, (stage) => stage.applications, { cascade: true })
  @JoinColumn({ name: 'stageId' })
  stage: Stage;

  @BeforeInsert()
  setApplicationDate() {
    this.applicationDate = new Date();
  }
}
