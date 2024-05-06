import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Recruiter } from '../../employer/entities/employer.entity';
import { Job } from '../../job/entities/job.entity';
import { HiredApplicant } from '../../job/entities/hiredApplicant.entity';
@Entity('company')
export class Company {
  @PrimaryGeneratedColumn()
  companyId: number;

  @Column({ nullable: true })
  companyName: string;

  @Column({ nullable: true })
  companyEmail: string;

  @Column({ nullable: true })
  companyProfile: string;

  @Column({ nullable: true })
  companyWebsite: string;

  @Column({ nullable: true })
  companyAddress: string;

  @Column({ nullable: true })
  companyPhone: string;

  @OneToMany((type) => Recruiter, (recruiter) => recruiter.company)
  recruiters: Recruiter[];

  @OneToMany((type) => Job, (job) => job.company)
  jobs: Job[];

  @OneToMany(
    (type) => HiredApplicant,
    (hiredApplicant) => hiredApplicant.company,
    { cascade: true },
  )
  hiredApplicants: HiredApplicant[];
}
