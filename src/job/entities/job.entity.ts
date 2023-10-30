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
} from 'typeorm';
import { Company } from '../../company/entities/company.entity';
import { Application } from '../../application/entities/application.entity';
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
  jobCreatedAt: Date;

  // TODO: ADD WORKFLOW TYPE
  @Column({ nullable: true, type: 'jsonb' })
  workFlow: string[];

  @ManyToOne((type) => Company, (company) => company.jobs)
  @JoinColumn({ name: 'companyId' })
  company: Company;

  @Column({ nullable: true })
  companyId: number;

  @OneToMany(() => Application, (application) => application.job)
  applications: Application[];

  @BeforeInsert()
  setJobCreatedAt() {
    this.jobCreatedAt = new Date();
  }
}
