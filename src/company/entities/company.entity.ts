import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Recruiter } from 'src/employer/entities/employer.entity';

@Entity('company')
export class Company {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  companyName: string;

  @Column({ nullable: true })
  companyEmail: string;

  @Column({ nullable: true })
  companyWebsite: string;

  @Column({ nullable: true })
  companyAddress: string;

  @Column({ nullable: true })
  companyPhone: number;

  @OneToMany((type) => Recruiter, (recruiter) => recruiter.company)
  recruiters: Recruiter[];
}
