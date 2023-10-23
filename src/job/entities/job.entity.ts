import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Company } from 'src/company/entities/company.entity';
import { Application } from 'src/application/entities/application.entity';
@Entity('job')
export class Job {
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
