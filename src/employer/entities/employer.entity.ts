import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { Role } from '../../auth/model/role.enum';
import { Company } from '../../company/entities/company.entity';
import { Job } from 'src/job/entities/job.entity';
@Entity()
export class Recruiter {
  @PrimaryGeneratedColumn()
  recruiterId: number;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false, unique: true })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({ nullable: false })
  phone: string;

  @Column({ nullable: true, default: Role.Employer })
  role: string;

  @Column({ nullable: true })
  designation: string;

  @ManyToOne((type) => Company, (company) => company.recruiters)
  @JoinColumn({ name: 'companyId' })
  company: Company;

  @OneToMany(() => Job, (job) => job.recruiter)
  jobs: Job[];
}
